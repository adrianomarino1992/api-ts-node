import { Request, Response } from "express";
import { Exception } from "../app/app";

export function AuthenticationHandler(req : Request, resp : Response) : void
{
    if(req.headers.mykey == "key")
        req.headers["Auth"] = "true";
    else
        throw new Exception("User not authorized");    
}