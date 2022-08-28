import { IPerson } from "./interfaces/Iperson";
import { IEvent, IParticipantOnEvent } from "./interfaces/Ievent";
import { Required } from "../decorators/object.decorators";
import { NotEmpty } from "../decorators/string.decorators";
import { Validator } from "../decorators/validatorHandler";
import ValidationResultHandler from '../decorators/handlers/validationResultHandler'
import { MaxValue } from "../decorators/number.decorators";
import { Exception } from "../app/app";


export class Event implements IEvent
{
    @MaxValue(2147483647)
    Id : number;

    @Required()
    @NotEmpty()
    @Validator(ValidationResultHandler)
    Title : string;

    @Required()
    @NotEmpty()
    @Validator(ValidationResultHandler)
    Description : string;

    @Required()    
    @Validator(ValidationResultHandler)
    Date : Date;

    Participants : IParticipantOnEvent[] = [];

    @Required("Event's owner is required") 
    @Validator(ValidationResultHandler)
    Owner : IPerson;

    constructor(data : IEvent)
    {
        if(!data.Owner.Id)
            throw new Exception("Event's owner is required");
            
        this.Id = data.Id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.Date = data.Date;
        this.Participants = data.Participants ?? [];
        this.Owner = data.Owner;        
    }

    
}


