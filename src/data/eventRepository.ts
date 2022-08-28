import "reflect-metadata";
import Repository from "./repository";
import { EventDTO } from "./dto/eventDTO";
import { MetadataKeys } from "../decorators/validatorHandler";
import { IPerson } from "../models/interfaces/Iperson";
import { IEvent, IParticipantOnEvent } from "../models/interfaces/Ievent";
import { Prisma } from "@prisma/client";
import PersonRepository from "./personRepository";
import { PersonDTO } from "./dto/personDTO";
import IEventRepository from "../models/interfaces/IeventRepository";



export default class EventRepository extends Repository<EventDTO> implements IEventRepository<EventDTO, PersonDTO> {
  constructor() {
    super(Reflect.getMetadata(MetadataKeys.PrismaCollectionKey, EventDTO));
  }

  public async GetByOwner(ownerId : number) : Promise<EventDTO[]>
  {
    return (await this._cli.event.findMany({ where : { OwnerId : ownerId} , include : { Owner : true, Participants : true} , orderBy: [ {Date : "desc"}, {Title : "asc"}]})) as unknown as EventDTO[];
  }

  public async GetByParticipant(partId : number) : Promise<EventDTO[]>
  {
    let evts = (await this._cli.participantOnEvent.findMany({where : { PersonId : partId}})).map(s => s.EventId) as number[];

    return (await this._cli.event.findMany({ where : { Id : { in : evts }} , include : { Owner : true, Participants : true} , orderBy: [ {Date : "desc"}, {Title : "asc"}]})) as unknown as EventDTO[];
  }

  public async GetByDate(date : Date) : Promise<EventDTO[]>
  {
    return (await this._cli.event.findMany({ where : { Date : { equals : new Date(new Date(date).toISOString()) }} , include : { Owner : true, Participants : true} , orderBy: [ {Date : "desc"}, {Title : "asc"}]})) as unknown as EventDTO[];
  }
  
  public async GetByDateRange(init : Date, over : Date) : Promise<EventDTO[]>
  {
    return (await this._cli.event.findMany({ where : { AND : [
      { Date : { gte : new Date(new Date(init).toISOString()) }}, 
      { Date : { lte : new Date(new Date(over).toISOString()) }}
    ]}, include : { Owner : true, Participants : true}, orderBy: [ {Date : "desc"}, {Title : "asc"}]})) as unknown as EventDTO[];
  }

  public async AddParticipant(
    evt: EventDTO,
    part: PersonDTO
  ): Promise<EventDTO> {
    let event: EventDTO | null;
    let person: PersonDTO | null;

   

    if (part.Id == 0 || part.Id == undefined)
      person = await new PersonRepository().Add(part);
    else {
      person = await new PersonRepository().Refresh(part);
    }

    try {
      event = new EventDTO((await this._cli.event.findFirst({
        where: { Date: new Date(new Date(evt.Date).toISOString()) },
        include: { Owner: true, Participants: true },
      })) as unknown as EventDTO);

      if (
        event.Participants.find((s) => s.PersonId == person?.Id) == undefined
      ) {
        await this._cli.participantOnEvent.create({
          data: {
            EventId: event.Id,
            PersonId: person.Id,
          },
        });

        event.Participants.push(
          (await this._cli.participantOnEvent.findFirst({
            where: { AND: [{ EventId: event.Id }, { PersonId: person.Id }] },
          })) as IParticipantOnEvent
        );
      }

      return event as EventDTO;
    } catch (ex) {
      this._cli.$disconnect();

      throw ex;
    }
  }

  public async RemoveParticipant(
    evt: EventDTO,
    part: PersonDTO
  ): Promise<EventDTO> {
    let event: EventDTO | null;
    let person: PersonDTO | null;


    if (part.Id == 0 || part.Id == undefined)
      person = await new PersonRepository().Add(part);
    else {
      person = await new PersonRepository().Refresh(part);
    }

    try {
      event = new EventDTO((await this._cli.event.findFirst({
        where: { Date: new Date(new Date(evt.Date).toISOString()) },
        include: { Owner: true, Participants: true },
      })) as unknown as EventDTO);

      if (
        event.Participants.find((s) => s.PersonId == person?.Id) != undefined
      ) {
        let d = await this._cli.participantOnEvent.findFirst({
          where: { AND: [{ EventId: event.Id }, { PersonId: person.Id }] },
        });

        await this._cli.participantOnEvent.delete({ where: { Id: d?.Id } });

        event.Participants = event.Participants.filter(
          (s) => s.PersonId != part.Id
        );
      }

      return event as EventDTO;
    } catch (ex) {
      this._cli.$disconnect();

      throw ex;
    }
  }
}
