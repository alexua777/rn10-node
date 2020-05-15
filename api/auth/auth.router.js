import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/register",
  authController.validateRegisteredUser,
  authController.registerUser
);
router.post("/login", authController.validateSignIn, authController.signIn);

export const authRouter = router;
