import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post(
  "/register",
  authController.validateRegisteredUser,
  authController.registerUser
);
router.post("/login", authController.validateSignIn, authController.signIn);
router.post("/logout", authController.authorize, authController.signOut);
router.get('/current', authController.getCurrentUser);

export const authRouter = router;
