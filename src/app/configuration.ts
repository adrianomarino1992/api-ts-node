import "reflect-metadata";
import { MaxValue, MinValue } from "../decorators/number.decorators";
import { Validator } from "../decorators/validatorHandler";
import { Required } from "../decorators/object.decorators";
import { NotEmpty } from "../decorators/string.decorators";
import ValidationResultHandler from "../decorators/handlers/validationResultHandler";


export class Configuration {
    @Required<string>()
    @NotEmpty()
    @Validator(ValidationResultHandler)
    public Root: string;
  
    @MinValue(1000)
    @MaxValue(4000)
    @Validator<number>(ValidationResultHandler)
    public Port: number;
  
    @Required<string>()
    @NotEmpty()
    @Validator(ValidationResultHandler)
    public IP: string;
  
    constructor(root: string, port: number, ip: string) {
      this.Root = root;
      this.Port = port;
      this.IP = ip;
    }    

  }
  