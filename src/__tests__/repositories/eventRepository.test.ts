import "reflect-metadata";
import EventRepository from "../../data/eventRepository";
import { MetadataKeys } from "../../decorators/validatorHandler";
import { PersonDTO } from "../../data/dto/personDTO";
import { IPerson } from "../../models/interfaces/Iperson";
import { EventDTO } from "../../data/dto/eventDTO";
import { IEvent } from "../../models/interfaces/Ievent";
import { Prisma, PrismaClient } from "@prisma/client";
import exp from "constants";

describe("Test the EventController", () => {
  test("Ctor", () => {
    let r: EventRepository = new EventRepository();

    let col = r.CollectionName;

    let eventMetadata: string = Reflect.getMetadata(
      MetadataKeys.PrismaCollectionKey,
      EventDTO
    );

    expect(eventMetadata).not.toBeNull();

    expect(eventMetadata.length).toBeGreaterThan(0);

    expect(col).not.toBeNull();

    expect(col.length).toBeGreaterThan(0);

    expect(eventMetadata).toBe(col);
  });

  test("Add new event", async () => {
    let r: EventRepository = new EventRepository();

    let cli: PrismaClient = new PrismaClient();

    let result: any = await cli.person.findFirst();

    let event = new EventDTO({
      Date: new Date(),
      Description: "Evento teste",
      Title: "Evento",
      Owner: result as IPerson,
    } as IEvent);

    cli.$connect();

    let count = await cli.event.count();

    await r.Add(event);

    let countAfter = await cli.event.count();

    await cli.event.delete({
      where: {
        Date: event.Date,
      },
    });

    cli.$disconnect();

    expect(count).toBe(countAfter - 1);
  }, 10000);

  test("Update a event", async () => {
    let r: EventRepository = new EventRepository();

    let cli: PrismaClient = new PrismaClient();

    let result: any = await cli.person.findFirst();

    let event = new EventDTO({
      Date: new Date(),
      Description: "Evento teste",
      Title: "Evento",
      Owner: result as IPerson,
    } as IEvent);

    cli.$connect();

    await cli.event.create({ data: event.ToCreateData() });

    event.Title = "Mudou";

    await r.Update(event);

    let back: IEvent | null = (await cli.event.findFirst({
      where: { Date: event.Date },
      include: { Owner: true },
    })) as unknown as IEvent;

    await cli.event.delete({
      where: {
        Date: event.Date,
      },
    });

    cli.$disconnect();

    expect(back).not.toBeNull();
    expect(back.Title).toEqual(event.Title);
    expect(back.Owner.Id).toBe(event.Owner.Id);
  }, 10000);

  test("Add a event participant", async () => {
    let r: EventRepository = new EventRepository();

    let cli: PrismaClient = new PrismaClient();

    let result: any = await cli.person.findFirst();

    let event = new EventDTO({
      Date: new Date(),
      Description: "Evento teste",
      Title: "Evento",
      Owner: result as IPerson,
    } as IEvent);

    cli.$connect();

    event = await r.Add(event);

    let first: PersonDTO = new PersonDTO(
      (await cli.person.findFirst({
        where: { Name: "Camila" }
      })) as unknown as IPerson
    );

    event = await r.AddParticipant(event, first as PersonDTO);

    let back: IEvent | null = (await cli.event.findFirst({
      where: { Date: event.Date },
      include: { Owner: true },
    })) as unknown as IEvent;

    cli.$disconnect();

    expect(back).not.toBeNull();
    expect(back.Title).toEqual(event.Title);
    expect(back.Owner.Id).toBe(event.Owner.Id);
  }, 100000);

  test("Remove a event participant", async () => {
    let r: EventRepository = new EventRepository();

    let cli: PrismaClient = new PrismaClient();

    let result: any = await cli.person.findFirst();

    let event = new EventDTO({
      Date: new Date(),
      Description: "Evento teste",
      Title: "Evento",
      Owner: result as IPerson,
    } as IEvent);

    cli.$connect();

    event = await r.Add(event);

    let first: PersonDTO = new PersonDTO(
      (await cli.person.findFirst({
        where: { Name: "Camila" }
      })) as unknown as IPerson
    );    

    event = await r.AddParticipant(event, first);

    let second: PersonDTO = new PersonDTO(
        (await cli.person.findFirst({
          where: { Name: "Juliana" }
        })) as unknown as IPerson
      );

    event = await r.AddParticipant(event, second);

    cli.$disconnect();

    expect(event).not.toBeNull();
    expect(event.Title).toEqual(event.Title);
    expect(event.Owner.Id).toBe(event.Owner.Id);
    expect(event.Participants.length).toBe(2);

    event = await r.RemoveParticipant(event, second);
    expect(event.Participants.length).toBe(1);
  }, 100000);
});
