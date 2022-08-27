import App , { Exception} from '../app/app';
import "reflect-metadata";
import express, { Express } from "express";
import { MetadataKeys } from "../decorators/validatorHandler";
import IController from "../controllers/Icontroller";
import { Verb } from "../enums/httpVerbs";
import { Request, Response } from "express";
import { UsingHandler } from "../decorators/controller.decorators";
import { Prisma } from "@prisma/client";
import ValidationException from "../exceptions/validationException";


export default class BaseController implements IController
{
    Append(app : App) : void{

        let route = Reflect.getMetadata(MetadataKeys.RouterKey, this.constructor);

      let methods: any[] = Reflect.ownKeys(this.constructor.prototype).filter(
        (s) => typeof (this as any)[s] == "function"
      );

      for (let p of methods) {
        let controller: IController = this;

        let actionMetadata: string = Reflect.getMetadata(
          MetadataKeys.ActionNameKey,
          this,
          p
        );

        if (!actionMetadata) continue;

        let arg: string = Reflect.getMetadata(MetadataKeys.ActionArgsKey, this, p);
        let verb: Verb = Reflect.getMetadata(MetadataKeys.ActionVerbKey, this, p);
        let middlewares: UsingHandler[] =
          Reflect.getMetadata(MetadataKeys.ActionUsing, this.constructor) ?? [];

        let handler: (req: Request, resp: Response) => void = async (
          req,
          resp
        ) => {
          try {

            middlewares.forEach((md) => {
              md(req, resp);
            });

            let argValue: any;

            if (arg) {
              argValue = req.body[arg];
            }

            let result = await (controller as any)[p](argValue);

            if (result) {
              resp.status(200).json(result);
            } else {
              resp.sendStatus(200);
            }
          } catch (ex) {        
            
            if(ex instanceof Prisma.PrismaClientKnownRequestError && ex.code == "P2025"){

              resp.status(400).json({ error : {
                message : "Register not found on database"
              }});

            }else if(ex instanceof ValidationException)
            {
              resp.status(400).json({ error : {
                message : "Validation fails", 
                details : ex.Details
              }});

            }else{

              resp.status(500).json({ error : {
                message : (ex as Exception).message, 
                stack : (ex as Exception).stack
            }});
          }
          }

          resp.end();
        };
        app.Express[verb](`${route}/${actionMetadata}`, handler);
      }

    }
}