
import 'reflect-metadata';
import { MetadataKeys } from './validatorHandler';
import {Verb} from '../enums/httpVerbs';
import { Request, Response } from 'express';

export function Controller(path : string) : (constructor : any) => void
{
    const controllerSymbol = "ow:controller";    
    const routeSymbol = "ow:route";   

    MetadataKeys.ControllerRouterKey = controllerSymbol;
    MetadataKeys.RouterKey = routeSymbol;

    return function controllerDecorator(constructor : any)
    {
        Reflect.defineMetadata(controllerSymbol, true, constructor);
        Reflect.defineMetadata(routeSymbol, path, constructor);       
    }
    
}

export function Use(using : UsingHandler ) : (constructor : any) => void
{
    const usingSymbol = "ow:using";           

    MetadataKeys.ActionUsing = usingSymbol;   

    return function controllerDecorator(constructor : any)
    {
        var middlewares : UsingHandler[] = Reflect.getMetadata(usingSymbol, constructor) ?? [];

        middlewares.push(using);

        Reflect.defineMetadata(usingSymbol, middlewares, constructor);              
    }
    
}



export function Action(name : string, ...args: string[]) : (target : any, method : string , descriptor : PropertyDescriptor) => void
{
    const actionSymbol = "ow:action" ; 
    const actionArgsSymbol = "ow:action-args" ; 

    MetadataKeys.ActionNameKey = actionSymbol;
    MetadataKeys.ActionArgsKey = actionArgsSymbol;

    return (target : any, method : string , descriptor : PropertyDescriptor) =>
    {
        Reflect.defineMetadata(actionSymbol, name, target, method);
        Reflect.defineMetadata(actionArgsSymbol, args, target, method);
         
    }
}

export function HttpVerb(verb : Verb) : (target : any, method : string , descriptor : PropertyDescriptor) => void
{
    const actionVerbSymbol = "ow:action-verb" ;      

    MetadataKeys.ActionVerbKey = actionVerbSymbol;

    return (target : any, method : string , descriptor : PropertyDescriptor) =>
    {
        Reflect.defineMetadata(actionVerbSymbol, verb, target, method);        
         
    }
}


export interface UsingHandler{
    (req : Request, resp : Response) : void;
}