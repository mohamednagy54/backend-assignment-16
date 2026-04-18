export function generateOTP() {
  const minNumber = 100000;
  const maxNumber = 999999;
  return Math.floor(Math.random() * (maxNumber - minNumber + 1)) + minNumber;
}
