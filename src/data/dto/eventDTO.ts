import { Map } from "../../decorators/prisma.decorators";
import { Event } from "../../models/event";
import IPrismaConvertible from '../dto/IprismaObject';
import { IEvent } from "../../models/interfaces/Ievent";

@Map("event")
export class EventDTO extends Event implements IPrismaConvertible
{

    constructor(data : IEvent){
        super(data);
    }

    public ToCreateData() : any
    {
        return {
            Description: this.Description,
            Title: this.Title,
            OwnerId: this.Owner.Id,
            Date : new Date(this.Date).toISOString()
          }
    }

    public GetUniqueKey() : any
    {
        return {
            Date : new Date(this.Date).toISOString()
        }
    }
    
}