import { createControllerProxy } from "../helpers/controllerProxy";
import { contactModel } from "../contacts/contacts.model";
import {
  ConflictError,
  UnauthorizedError,
  NotFound,
} from "../helpers/error.constructor";
const path = require("path");
require('dotenv').config({path: path.join(__dirname,".env") })
const sgMail = require('@sendgrid/mail');
import bcryptjs from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";


const JWT_SECRET = "dfsdfsfewfsfsdfsdfsdfsdf";
const SERVER_URL = "http://localhost:1000";
const COMPRESSED_IMAGES_BASE_URL = "images";

class AuthController {
  constructor() {
    this._saltrounds = 5;
    sgMail.setApiKey(process.env.SEND_GRID_API);
  }

  async registerUser(req, res, next) {
    try {
      //1. validate request body
      //2. check if email exisits in collection
      const { email, password } = req.body;
      const existingUser = await contactModel.findUserByEmail(email);
      console.log(existingUser);
      if (existingUser) {
        throw new ConflictError("Email in use");
      }

      //3. hash password
      const passwordHash = await this.hashpassword(password);

      const avatarURL = `${SERVER_URL}/${COMPRESSED_IMAGES_BASE_URL}/${req.file}`;

      //4. save user in DB
      const createdUser = await contactModel.createContact({
        email,
        password,
        passwordHash,
        avatarURL,
      });

      //5. email verification
      this.sendVerificationEmail(createdUser);
      //6. send response
      return res.status(201).json({
        user: this.composeUserForResponse(createdUser),
      });
    } catch (err) {
      next(err);
    }
  }

  async validateRegisteredUser(req, res, next) {
    const contactRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validateResult = Joi.validate(req.body, contactRules);
    if (validateResult.error) {
      return res
        .status(400)
        .json(`MissingFields:${validateResult.error.details[0].message}`);
    }
    next();
  }

  async hashpassword(password) {
    return bcryptjs.hash(password, this._saltrounds);
  }

  async comparePasswords(password, passwordHash) {
    return bcryptjs.compare(password, passwordHash);
  }

  async signIn(req, res, next) {
    try {
      //1. Validate req body
      //2. fetch user by email from DB
      const { email, password } = req.body;
      const user = await contactModel.findUserByEmail(email);

      if (!user) {
        throw new UnauthorizedError("User does not exist");
      }

      //3. check passwords hash
      const isPasswordCorrect = await this.comparePasswords(
        password,
        user.passwordHash
      );

      if (!isPasswordCorrect) {
        throw new UnauthorizedError("Password is incorrect");
      }

      //4. JWT
      const token = await this.createToken(user._id);

      await contactModel.updateContactById(user._id, { token });

      //5. send successfull response
      return res.status(200).json({
        user: this.composeUserForResponse(user),
        token,
      });
    } catch (err) {
      next(err);
    }
  }

  async sendVerificationEmail(user) {
    const verificationLink = `${process.env.SERVER_BASE_URL}/user/auth/verify/${user.verificationToken}`;
    
    await sgMail.send({
      to: user.email,
      from: process.env.SENDER_EMAIL,
      subject:"Please verify your email",
      html:`<a href="${verificationLink}">Click here to verify your email<a/>`
    })
  }

  async verifyUser(req, res, next) {
    try {
      const { verificationToken } = req.params;

      const userToVerify = await contactModel.findContactByToken(verificationToken);
      console.log(userToVerify);
      if (!userToVerify) {
        throw new NotFound("User not found");
      }

      await contactModel.verifyUser(verificationToken);
      return res.status(200).send("User successfully verified");
    } catch (err) {
      next(err);
    }
  }

  async createToken(uid) {
    return jwt.sign({ uid }, JWT_SECRET);
  }

  async validateSignIn(req, res, next) {
    const contactRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validateResult = Joi.validate(req.body, contactRules);
    if (validateResult.error) {
      return res
        .status(400)
        .json(`MissingFields:${validateResult.error.details[0].message}`);
    }
    next();
  }

  async authorize(req, res, next) {
    try {
      //1. Get tocken from header
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      //2. verify jwt token

      try {
        jwt.verify(token, JWT_SECRET);
      } catch (err) {
        throw new UnauthorizedError("User not authorized");
      }

      //3. Find user by token
      const user = await contactModel.findContactByToken(token);
      if (!user) {
        throw new UnauthorizedError("Token is not valid");
      }
      //4. Invoke next middleware
      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  async signOut(req, res, next) {
    try {
      await contactModel.updateContactById(req.user._id, { token: null });
      return res.status(204).json();
    } catch (err) {
      next(err);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      //1. Get tocken from header
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "");
      //2. verify jwt token

      try {
        jwt.verify(token, JWT_SECRET);
      } catch (err) {
        throw new UnauthorizedError("User not authorized");
      }

      //3. Find user by token
      const user = await contactModel.findContactByToken(token);
      if (!user) {
        throw new UnauthorizedError("Token is not valid");
      }
      //4. Invoke next middleware
      return res.status(200).json({
        user: this.composeUserForResponse(user),
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
    }
  }

  composeUserForResponse(user) {
    return {
      id: user._id,
      email: user.email,
      avatarURL: user.avatarURL,
    };
  }
}

export const authController = createControllerProxy(new AuthController());
