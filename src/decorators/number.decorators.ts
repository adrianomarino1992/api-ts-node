import NumberValidationException from "../exceptions/numberValidationException";
import "reflect-metadata";
import { IValidationResult, ValidationHandler, MetadataKeys } from "./validatorHandler";
import { strict } from "assert";



export function MinValue(min : number, msg? : string) : (target : any, key : string | symbol) => void 
{
    return (target : any, key : string | symbol) => 
    {
        let mk : string = "ow:minSymbol";

        MetadataKeys.AddValidationKey(mk);

        Reflect.defineMetadata(mk, (value: number) : IValidationResult => 
        {
            if(value == undefined || value == null)
            {
                 
                return {
                    Sucess : false,
                    Message : msg ?? `The property '${key.toString()}' is null`
                } as IValidationResult;
            }
    
            if(value < min){
                
                return {
                    Sucess : false,
                    Message : msg ?? `The property '${key.toString()}' must be greater than ${min}`
                } as IValidationResult;
            }   

            return {
                Sucess : true,
            } as IValidationResult;

        } , target, key);
    }
}


export function MaxValue(max : number, msg? : string) : (target : any, key : string | symbol) => void 
{
    return (target : any, key : string | symbol) => 
    {
        let mk : string = "ow:maxSymbol";

        MetadataKeys.AddValidationKey(mk);

        Reflect.defineMetadata(mk, (value: number) : IValidationResult => 
        {
            if(value == undefined || value == null)
            {
                 
                return {
                    Sucess : false,
                    Message : msg ?? `The property '${key.toString()}' is null`
                } as IValidationResult;
            }
    
            if(value > max){
                
                return {
                    Sucess : false,
                    Message : msg ?? `The property '${key.toString()}' must be smaller than ${max}`
                } as IValidationResult;
            }   

            return {
                Sucess : true,
            } as IValidationResult;

        } , target, key);
    }
}

