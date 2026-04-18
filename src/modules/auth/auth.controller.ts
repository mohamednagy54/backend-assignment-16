import { Router } from "express";
import authService from "./auth.service";
import type { NextFunction, Request, Response } from "express";
import { isValid } from "../../middleware";
import { signupSchema } from "./auth.validation";

const router = Router();

// signup
router.post(
  "/signup",
  isValid(signupSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    // call service
    await authService.signup(req.body);
    // send response
    return res.status(201).json({
      message: "user created successfully",
      success: true,
    });
  },
  
);


router.post("/verify-account",async (req: Request, res: Response, next: NextFunction) => {
  // call service
  await authService.verifyAccount(req.body);
  // send response
  return res.status(200).json({
    message: "user verified successfully",
    success: true,

  });
})


router.post("/send-otp",async (req: Request, res: Response, next: NextFunction) => {
  // call service
  await authService.sendOTP(req.body);
  // send response
  return res.status(200).json({
    message: "otp sent successfully",
    success: true,

  });
})

router.patch("/reset-password",async (req: Request, res: Response, next: NextFunction) => {
  // call service
  await authService.resetPassword(req.body);
  // send response
  return res.status(200).json({
    message: "password reset successfully",
    success: true,

  });
})

export default router;
