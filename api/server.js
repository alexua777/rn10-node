import express from "express";
import morgan from "morgan";
import path from "path";
import {contactRouter} from "./contacts/contact.router";

const PORT = 1000;


export class CrudServer {
    constructor(){
        this.server = null;
    }

    start(){
        this.initServer();
        this.initMiddleWare();
        this.initRoutes();
        this.handleErrors();
        this.startListening();
    }

    initServer(){
      this.server = express();  
    }

    initMiddleWare() {
        this.server.use(express.json());
        this.server.use(morgan("tiny"));
    }

    initRoutes(){
        this.server.use("/api/contacts", contactRouter);
    }

    handleErrors () {
        this.server.use((err,req, res, next) => {
            delete err.stack;

            return res.status(err.status).send(`${err.name}:${err.message}`);
        })
    }

    startListening(){
        this.server.listen(PORT, () => {
            console.log('server started on port', PORT);
        })
    }


}


