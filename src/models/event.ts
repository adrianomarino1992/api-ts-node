import { IPerson } from "./interfaces/Iperson";
import { IEvent, IParticipantOnEvent } from "./interfaces/Ievent";
import { Required } from "../decorators/object.decorators";
import { NotEmpty } from "../decorators/string.decorators";
import { Validator } from "../decorators/validatorHandler";
import ValidationResultHandler from '../decorators/handlers/validationResultHandler'


export class Event implements IEvent
{
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

    @Required()    
    @Validator(ValidationResultHandler)
    Owner : IPerson;

    constructor(data : IEvent)
    {
        this.Id = data.Id;
        this.Title = data.Title;
        this.Description = data.Description;
        this.Date = data.Date;
        this.Participants = data.Participants ?? [];
        this.Owner = data.Owner;        
    }

    
}


