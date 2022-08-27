import { IEvent } from "./Ievent";
import { IPerson } from "./Iperson";
import IRepository from "./Irepository";

export default interface IEventRepository<T extends IEvent, P extends IPerson> extends IRepository<T>{

    GetByOwner(ownerId : number) : Promise<T[]>;
    GetByParticipant(partId : number) : Promise<T[]>;
    GetByDate(date : Date) : Promise<T[]>;
    GetByDateRange(init : Date, over : Date) : Promise<T[]>;
    AddParticipant(evt: T, part: P): Promise<T>;
    RemoveParticipant(evt: T, part: P): Promise<T>;
}