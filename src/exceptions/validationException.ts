import { IValidationResult } from "../decorators/validatorHandler";

export default class ValidationException extends Error 
{
    public Details : string[];

    constructor(results: IValidationResult[])
    {
        let msg : string = "\r\n";
        results.map(ele => `${ele.Message}\r\n`).forEach(s => msg += s);

        super(msg);
        
        this.Details = results.map(s => s.Message) as string[];
        
    }

}