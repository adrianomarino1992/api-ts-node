import "reflect-metadata";
import express, { Express } from "express";
import PersonController from "../controllers/personController";
import EventController from "../controllers/eventController";
import { Configuration } from "./configuration";


export default class Application {

  public Configurations: Configuration;

  public Express: Express;

  constructor(config: Configuration) {

    if (!config)
      throw new Exception(`Configuration must be a not null object`);

    this.Configurations = config;

    this.Express = express();

    this.Express.use(express.urlencoded({ extended: true }));

    this.Express.use(express.json({ limit: 1024 * 1024 * 20 }));
  }


  public StartServer(callback: (config: Configuration) => void) {
    
     this.Express.listen(this.Configurations.Port || 1234,this.Configurations.IP || "127.0.0.1",

        async () => {

          new PersonController().Append(this);
          new EventController().Append(this);

          callback(this.Configurations);          
        }
      );
   }  
}


export class Exception extends Error {}
