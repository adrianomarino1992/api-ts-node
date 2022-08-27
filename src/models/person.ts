import { Required } from "../decorators/object.decorators";
import { NotEmpty } from "../decorators/string.decorators";
import { Validator } from "../decorators/validatorHandler";
import { IPerson } from "./interfaces/Iperson";
import ValidationResultHandler from '../decorators/handlers/validationResultHandler'
import { CheckRegex } from "../decorators/regex.decorator";

export class Person implements IPerson
{    
   
    public Id : number;

    @Required()
    @NotEmpty()
    @Validator(ValidationResultHandler)
    public Name : string;

    @Required()
    @NotEmpty()
    @CheckRegex(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 
    "The email is not a valid email address")
    @Validator(ValidationResultHandler)
    public Email : string;

    @Required()
    @NotEmpty()
    @CheckRegex('^[0-9]*$', "The phone number must contains only digits")
    @Validator(ValidationResultHandler)
    public Phone : string;

    public Events : Event[] = [];

    constructor(data : IPerson)
    {
       this.Id = data.Id;
       this.Name = data.Name;
       this.Email = data.Email;
       this.Phone = data.Phone;
       this.Events = data.Events;
    }    
}