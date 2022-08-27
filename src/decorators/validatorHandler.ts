export class MetadataKeys 
{
    public static ValidationsKeys : string[] = []

    public static ControllerRouterKey : string;

    public static RouterKey : string;

    public static ActionNameKey : string;

    public static ActionArgsKey : string;

    public static ActionVerbKey : string;

    public static ActionUsing : string;

    public static PrismaCollectionKey : string;

    public static AddValidationKey(key : string) : void
    {
        if(this.ValidationsKeys.indexOf(key) == -1)
            this.ValidationsKeys.push(key);
    }
}


export interface ValidationHandler<T>
{
    (results : IValidationResult[] ) : void;
}

export interface IValidationResult
{
    Sucess : boolean, 
    Message? : string
}


export function Validator<T>(callback : ValidationHandler<T>) : (target : any, key : string | symbol) => void 
{    
    return new ValidatorFunctionContainer<T>().CreateGettersAndSetters(callback);
}


export class ValidatorFunctionContainer<T>
{  
    private _refval : any;

    CreateGettersAndSetters(callback : ValidationHandler<T>) : (target: any, key : string | symbol) => void
    { 
        return (target: any, key : string | symbol) : void => 
        {
            this._refval = target[key];       
            
            const get = ()=> this._refval;
    
            const set = (value: T) => 
            {
                let erros : IValidationResult[] = [];
                
                for(let k of MetadataKeys.ValidationsKeys)
                {
                    let m = Reflect.getMetadata(k, target, key);
                    if(m)
                    {
                        let result : IValidationResult = m(value);
    
                        if(!result.Sucess)
                        {
                            erros.push(result);
                        }
                    }
                }
                
                if(erros.find(el => !el.Sucess))
                {
                    callback(erros);
                }
                
    
                this._refval = value;
            }
    
            Object.defineProperty(target, key, 
                {
                    get : get, 
                    set : set, 
                    configurable : true
                });
     
            
        }

    }
}