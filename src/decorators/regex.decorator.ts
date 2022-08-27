import { MetadataKeys, IValidationResult } from "./validatorHandler";
import 'reflect-metadata';
const regexSymbol = "ow:regex";

export function CheckRegex(regex : any, msg? : string) : (target : any, key : string | symbol) => void
{
    MetadataKeys.AddValidationKey(regexSymbol);

    return (target : any, key : string | symbol) => 
    {
        Reflect.defineMetadata(regexSymbol, (str : string) : IValidationResult => 
        {
            if(!new RegExp(regex).test(str))
            {
                return{
                    Sucess : false, 
                    Message : msg ?? `The property '${key.toString()}' fails on regex validation`
                } as IValidationResult;
            }

            return {
                Sucess : true
            } as IValidationResult;

        }, target, key);
    }
}