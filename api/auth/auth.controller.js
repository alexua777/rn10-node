import { createControllerProxy } from "../helpers/controllerProxy";
import { contactModel } from "../contacts/contacts.model";
import { ConflictError } from "../helpers/error.constructor";
import bcryptjs from "bcryptjs";
import Joi from "joi";
import jwt from "jsonwebtoken";

const JWT_SECRET = "dfsdfsfewfsfsdfsdfsdfsdf";

class AuthController {
  constructor() {
    this._saltrounds = 5;
  }

  async registerUser(req, res, next) {
    try {
      //1. validate request body
      //2. check if email exisits in collection
      const { email, password } = req.body;
      const existingUser = await contactModel.findUserByEmail(email);
      if (existingUser) {
        throw new ConflictError("Email in use");
      }

      //3. hash password
      const passwordHash = await this.hashpassword(password);

      //4. save user in DB
      const createdUser = await contactModel.createContact({
        email,
        password,
        passwordHash,
      });

      //send response
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
      const token = this.createToken(user._id);
      await contactModel.updateContactById(user._id, {token});

      //5. send successfull response
      return res.status(200).json({
        user: this.composeUserForResponse(user),
        token,
      });

    }catch (err) {
      next(err);
    }
  }

  async createToken (uid) {
    return jwt.sign({uid}, JWT_SECRET);
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

  composeUserForResponse(user){
    return {
      id: user._id,
      email: user.email,
    };
  }
}

export const authController = createControllerProxy(new AuthController());
