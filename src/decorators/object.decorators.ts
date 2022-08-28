import 'reflect-metadata';
import { IValidationResult, MetadataKeys, ValidationHandler } from "./validatorHandler";
const requiredSymbol = "ow:required";

export function Required<T>(msg? : string) : (target : any, key : string | symbol) => void
{
    return (target : any, key : string | symbol) => 
    {
        MetadataKeys.AddValidationKey(requiredSymbol);

        return Reflect.defineMetadata(requiredSymbol, (value : T) : IValidationResult => 
        {
            let empty = {}
            if(value == null || value == undefined)
            {
                return {
                    Sucess : false, 
                    Message : msg ?? `The property '${key.toString()}' must be not null object`
                } as IValidationResult;
            }

            return{ Sucess : true} as IValidationResult;

        }, target, key);
        
    }
}


