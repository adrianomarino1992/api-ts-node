import { MetadataKeys, IValidationResult } from "./validatorHandler";

const notEmptySymbol : string = "ow:notEmpty";

export function NotEmpty(msg? : string) : (target : any, ket : string | symbol) => void
{
    MetadataKeys.AddValidationKey(notEmptySymbol);

    return (target : any, key : string | symbol) => 
    {
        Reflect.defineMetadata(notEmptySymbol, (str : string) : IValidationResult =>
        {

            if(str == undefined || str == null || str.length == 0)
            {
                return {
                    Sucess : false, 
                    Message : msg ?? `The property '${key.toString()}' must be not empty`
                } as IValidationResult;
            }

            return{
                Sucess : true
            } as IValidationResult;
           
        }, target, key);
    }
}
