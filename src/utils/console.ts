export default class Console
{
    private static cian : string = "\x1b[36m";
    private static red : string = "\x1b[31m";
    private static yellow : string = "\x1b[33m";
    private static green : string = "\x1b[32m";
    private static white : string = "\x1b[37m";

    public static Enabled : boolean = true;

    public static Write<T>(object : T) : void
    {
        this._log(this.white,object);
    }

    
    public static Info<T>(msg : T) : void
    {
        this._log(this.cian, msg);
    }

    public static Warning<T>(msg : T) : void
    {
        this._log(this.yellow, msg);
    }

    public static Error<T>(msg : T) : void
    {
        this._log(this.red, msg);
    }

    public static Sucess<T>(msg : T) : void
    {
        this._log(this.green, msg);
    }
    
    private static _log<T>(color : string, object : T) : void
    {
        if(this.Enabled)
            console.log(color, object);
    }
    
}