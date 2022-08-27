import { IPerson } from "./Iperson";

export interface IEvent
{
    Id : number;
    Title : string;
    Description : string;
    Date : Date, 
    Participants : IParticipantOnEvent[],
    Owner : IPerson
}

export interface IParticipantOnEvent
{
    Id : number;
    PersonId : number;
    EventId : number;
}