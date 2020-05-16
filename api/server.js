import express from "express";
import morgan from "morgan";

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
import { contactRouter } from "./contacts/contact.router";
import nongoose from "mongoose";
import { authRouter } from "./auth/auth.router";

const PORT = 1000;
const MONGO_DB_URL =
  "mongodb+srv://db_admin:0W0kaqvfLNYrjSI7@cluster0-xfoxb.mongodb.net/db-contacts?retryWrites=true&w=majority";
const MONGO_DB_NAME = "db-contacts";

export class CrudServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleWare();
    this.initRoutes();
    this.handleErrors();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleWare() {
    this.server.use(express.json());
    this.server.use(morgan("tiny"));
  }

  initRoutes() {
    // this.server.use("/api/contacts", contactRouter);
    this.server.use("/auth", authRouter);
  }

  handleErrors() {
    this.server.use((err, req, res, next) => {
      console.log(err);
      debugger;
      delete err.stack;

      return res.status(err.status || 500).send(`${err.name}:${err.message}`);
    });
  }

  async initDatabase() {
    try {
      await nongoose.connect(MONGO_DB_URL);
      console.log("Database connection successful");
    } catch (err) {
      console.log("MongoDB connection error", err);
      process.exit(1);
    }
  }

  startListening() {
    this.server.listen(PORT, () => {
      console.log("server started on port", PORT);
    });
  }
}
