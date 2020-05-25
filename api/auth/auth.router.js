import { Router } from "express";
import { authController } from "./auth.controller";

import { upload, generateAvatar, compressContactAvatar, updateContactAvatar} from "./upload.middleware";

const router = Router();

router.post(
  "/register",
  authController.validateRegisteredUser,
  generateAvatar,
  authController.registerUser
);
router.patch("/avatar",authController.authorize, upload.single("avatar"), compressContactAvatar, updateContactAvatar);
router.post("/login", authController.validateSignIn, authController.signIn);
router.post("/logout", authController.authorize, authController.signOut);
router.get("/current", authController.getCurrentUser);
router.get("/auth/verify/:verificationToken", authController.verifyUser);

export const authRouter = router;
