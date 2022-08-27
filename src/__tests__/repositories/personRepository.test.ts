import "reflect-metadata";
import PersonRepository from "../../data/personRepository";
import { MetadataKeys } from "../../decorators/validatorHandler";
import { PersonDTO } from "../../data/dto/personDTO";
import { IPerson } from "../../models/interfaces/Iperson";
import { Prisma, PrismaClient } from "@prisma/client";

describe("Test PersonRepository", () => {
  test("Ctor", () => {
    let r: PersonRepository = new PersonRepository();

    let col = r.CollectionName;

    let personMetadata: string = Reflect.getMetadata(
      MetadataKeys.PrismaCollectionKey,
      PersonDTO
    );

    expect(personMetadata).not.toBeNull();

    expect(personMetadata.length).toBeGreaterThan(0);

    expect(col).not.toBeNull();

    expect(col.length).toBeGreaterThan(0);

    expect(personMetadata).toBe(col);
  });

  test("Add new person", async () => {
    let r: PersonRepository = new PersonRepository();

    let cli: PrismaClient = new PrismaClient();

    let person = new PersonDTO({
      Email: "ana@gmail.com",
      Name: "Ana",
      Phone: "1298674532",
    } as IPerson);

    cli.$connect();

    let count = await cli.person.count();

    await r.Add(person);

    let countAfter = await cli.person.count();

    await cli.person.delete({
      where: {
        Email: person.Email,
      },
    });

    cli.$disconnect();

    expect(count).toBe(countAfter - 1);
  }, 10000);

  test("Update a person", async () => {
    let r: PersonRepository = new PersonRepository();

    let cli: PrismaClient = new PrismaClient();

    let person = new PersonDTO({
      Email: "ana@gmail.com",
      Name: "Ana",
      Phone: "1298674532",
    } as IPerson);

    cli.$connect();

    await cli.person.create({ data: person.ToCreateData() });

    person.Name = "Carol";

    await r.Update(person);

    let result = await cli.person.findFirst({ where: { Email: person.Email } });

    await cli.person.delete({
      where: {
        Email: person.Email,
      },
    });

    cli.$disconnect();

    expect(result?.Name).toBe("Carol");
  }, 10000);

  test("Get person", async () => {
    let r: PersonRepository = new PersonRepository();

    let cli: PrismaClient = new PrismaClient();

    let person = new PersonDTO({
      Email: "ana@gmail.com",
      Name: "Ana",
      Phone: "1298674532",
    } as IPerson);

    cli.$connect();

    await cli.person.create({ data: person.ToCreateData() });

    let result: any = await cli.person.findFirst({
      where: person.GetUniqueKey(),
    });

    await cli.person.delete({
      where: {
        Email: person.Email,
      },
    });

    cli.$disconnect();

    expect(person.Name).toBe(result.Name);
  }, 10000);

  test("Get person and events", async () => {
    let r: PersonRepository = new PersonRepository();

    let cli: PrismaClient = new PrismaClient();

    let person = new PersonDTO({
      Email: "ana@gmail.com",
      Name: "Ana",
      Phone: "1298674532",
    } as IPerson);

    cli.$connect();

    await cli.person.create({ data: person.ToCreateData() });

    let result: any = await cli.person.findFirst({
      where: person.GetUniqueKey(),
    });

    await cli.event.create({
      data: {
        Description: "First event of seed",
        Title: "The first",
        OwnerId: result.Id,
      },
    });

    let personWithEvents = await cli.person.findFirst({
      where: person.GetUniqueKey(),
      include: { Events: true },
    });

    expect(personWithEvents).not.toBeNull();
    expect(personWithEvents?.Events).not.toBeNull();
    expect(personWithEvents?.Events.length).toBeGreaterThan(0);

    await cli.event.delete({
      where: { Id: personWithEvents?.Events[0].Id },
    });

    await cli.person.delete({
      where: {
        Email: person.Email,
      },
    });

    cli.$disconnect();

    expect(person.Name).toBe(result.Name);
  }, 10000);

  test("Delete person", async () => {
    let r: PersonRepository = new PersonRepository();

    let cli: PrismaClient = new PrismaClient();

    let person = new PersonDTO({
      Email: "ana@gmail.com",
      Name: "Ana",
      Phone: "1298674532",
    } as IPerson);

    cli.$connect();

    await cli.person.create({ data: person.ToCreateData() });

    await r.Delete(person);

    let result: any;

    try {
      result = await cli.person.findFirst({ where: person.GetUniqueKey() });

      await cli.person.delete({
        where: {
          Email: person.Email,
        },
      });
    } catch (ex) {
      if (
        ex instanceof Prisma.PrismaClientKnownRequestError &&
        ex.code == "P2025"
      ) {
        expect(result).toBeNull();
      } else {
        throw ex;
      }
    } finally {
      cli.$disconnect();
    }
  }, 10000);
});
