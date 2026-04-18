import {
  BadRequestException,
  ConflictException,
  encrypt,
  generateOTP,
  hash,
  NotFoundException,
  sendMail,
} from "../../common";
import { UserRepository } from "../../DB/models/user/user.repository";
import {
  deleteFromCache,
  getFromCache,
  setIntoCache,
} from "../../DB/redis.service";
import {
  
  LoginDto,
  ResetPasswordDto,
  SendOTPDTO,
  SignupDto,
  VerifyAccountDTO,
} from "./auth.dto";

class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async signup(signupDTO: SignupDto) {
    const { email } = signupDTO;
    // check user existence
    const user = await this.userRepository.getOne({ email });
    if (user) throw new ConflictException("user already exists");
    // hash password
    signupDTO.password = await hash(signupDTO.password);
    // encryption phone number
    if (signupDTO.phoneNumber)
      signupDTO.phoneNumber = encrypt(signupDTO.phoneNumber);
    // send otp
    const otp = generateOTP();
    // send email
    await sendMail({
      to: email,
      subject: "Confirm email",
      text: `<p>your otp to verify account is ${otp}</p>`,
    });
    //  save otp into redis ttl 5 minutes
    await setIntoCache(`${signupDTO.email}:otp`, otp, 3 * 60);

    // create user into redis
    await setIntoCache(
      signupDTO.email,
      JSON.stringify(signupDTO),
      3 * 24 * 60 * 60,
    );
  }

  login(data: LoginDto) {}
  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    let { email, otp, newPassword } = resetPasswordDto;
    // check email valid
    const userExist = await this.userRepository.getOne({ email });
    if (!userExist) throw new NotFoundException("user not found");
    // check otp valid
    const otpFromCache = await getFromCache(`${email}:otp`)
    if (otpFromCache != otp || !otpFromCache) { 
      throw new BadRequestException("invalid otp")
    }
    // hash password
    newPassword = await hash(newPassword)
    // update password
    this.userRepository.updateOne({ email }, { password: newPassword })
    // delete otp from cache
    await deleteFromCache(`${email}:otp`)


  }

  async sendOTP(sendOTPDTO: SendOTPDTO) {
    const { email } = sendOTPDTO;
    // check user exist
    const userExistsIntoDB = await this.userRepository.getOne({ email });
    // check email existence into cache
    const userExistIntoCache = await getFromCache(email);

    if (!userExistIntoCache && !userExistsIntoDB) {
      throw new NotFoundException("user not found, please signup");
    }

    // check already has a valid otp
    const otpExists = await getFromCache(`${email}:otp`);
    if (otpExists)
      throw new BadRequestException("otp already sent, please wait 5 minutes");
    // generate new otp
    const otp = generateOTP();
    // send mail
    await sendMail({
      to: email,
      subject: "Confirm email",
      html: `<p>your otp to verify account is ${otp}</p>`,
    });

    // set into cache
    await setIntoCache(`${email}:otp`, otp, 3 * 60);
  }

  async verifyAccount(verifyAccountDTO: VerifyAccountDTO) {
    const { email, otp } = verifyAccountDTO;
    // get user data from cache
    const user = await getFromCache(email);
    if (!user) throw new NotFoundException("user not found");
    // verify otp
    const storedOtp = await getFromCache(`${email}:otp`);
    if (!storedOtp) throw new BadRequestException("otp is expired");
    if (storedOtp !== otp) throw new BadRequestException("invalid otp");

    // convert to real user
    await this.userRepository.create(JSON.parse(user));

    // delete otp from redis
    await deleteFromCache(`${email}:otp`);
    await deleteFromCache(email);
  }
}

export default new AuthService();
