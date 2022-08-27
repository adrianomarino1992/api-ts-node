import { PrismaClient } from "@prisma/client";
import Console from "../utils/console";

const cli: PrismaClient = new PrismaClient();

async function Main() {
  if ((await cli.person.count()) == 0) {
    await cli.person.createMany({
      data: [
        {
          Email: "adriano@gmail.com",
          Name: "Adriano",
          Phone: "12982068255",
        },
        {
          Email: "camila@gmail.com",
          Name: "Camila",
          Phone: "12982068255",
        },
        {
          Email: "juliana@gmail.com",
          Name: "Juliana",
          Phone: "12982068255",
        },
        {
          Email: "Andre@gmail.com",
          Name: "Andre",
          Phone: "12982068255",
        },
      ],
    });
  }

  if ((await cli.event.count()) == 0) {
    await cli.event.createMany({
      data: [
        {
          Description: "First event of seed",
          Title: "The first",
          OwnerId: (
            await cli.person.findFirst({
              where: { Name: "Adriano" },
            })
          )?.Id!,
          Date : new Date()         
        },
      ],
    });
  }
  
  if ((await cli.participantOnEvent.count()) == 0) {
    await cli.participantOnEvent.createMany({
      data: [
        {
          EventId: (await cli.event.findFirst())?.Id!,
          PersonId: (
            await cli.person.findFirst({
              where: { Name: "Adriano" },
            })
          )?.Id!,
        },
        {
          EventId: (await cli.event.findFirst())?.Id!,
          PersonId: (
            await cli.person.findFirst({
              where: { Name: "Camila" },
            })
          )?.Id!,
        },
        {
          EventId: (await cli.event.findFirst())?.Id!,
          PersonId: (
            await cli.person.findFirst({
              where: { Name: "Juliana" },
            })
          )?.Id!,
        },
        {
          EventId: (await cli.event.findFirst())?.Id!,
          PersonId: (
            await cli.person.findFirst({
              where: { Name: "Andre" },
            })
          )?.Id!,
        },
      ],
    });
  }


  Console.Info("Persons: ");

  Console.Write(await cli.person.findMany());

  Console.Info("Events: ");

  Console.Write(await cli.event.findMany());

  Console.Info("Events x Persons: ");

  Console.Write(
    await cli.event.findMany({
      where: {
        Owner: (await cli.person.findFirst({ where: { Name: "Adriano" } }))!,
      }, include : 
      {
        Participants : true
      }
    })
  );


  let collection : any = Reflect.get(cli, "person");

  Console.Write(await collection.findMany());

}

Main()
  .then(() => {
    cli.$disconnect();    
  })
  .catch((err) => {
    Console.Error(err);

    cli.$disconnect();
  });
