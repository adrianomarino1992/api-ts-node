import 'reflect-metadata';
import PersonController from '../../controllers/personController';
import { MetadataKeys } from '../../decorators/validatorHandler';
import { PersonDTO } from '../../data/dto/personDTO';
import {IPerson} from '../../models/interfaces/Iperson';
import PersonRepository from '../../data/personRepository';

describe("Testing PersonController", ()=>
{    

    test("cTor", ()=>
    {     
        let controller : PersonController = new PersonController();   
        
    })


    test("Get route", ()=>{

        let controller : PersonController = new PersonController();

        let key = MetadataKeys.RouterKey;

        let route = Reflect.getMetadata(key, controller.constructor);
        
        expect(route).toBe("/persons");

    })


    test("Test GetAll action metadata", ()=>{

        let controller : PersonController = new PersonController();

        let key = MetadataKeys.ActionNameKey;

        let action = Reflect.getMetadata(key, controller, controller.GetAll.name);
        
        expect(action).toBe("getAll");

    })


    test("Test GetAll", async ()=>{

        let controller : PersonController = new PersonController();

        let all : PersonDTO[] = await controller.GetAll();
        
        expect(all).not.toBeNull();
        expect(all.length).toBe(4);

    })


    test("Test GetByEmail", async ()=>{

        let controller : PersonController = new PersonController();

        let all : PersonDTO[] = await controller.GetByEmail("adriano@gmail.com");
        
        expect(all).not.toBeNull();
        expect(all.length).toBe(1);

    })


    test("Test Add", async ()=>{

        let controller : PersonController = new PersonController();

        let person = new PersonDTO({
            Email : "ana@gmail.com",
            Name : "Ana", 
            Phone : "1298674532"
        } as IPerson)

        await controller.Add(person);
        
        let a : PersonDTO = new PersonDTO((await controller.GetByEmail(person.Email))[0] as IPerson);

        expect(a).not.toBeNull();
        expect(a.Email).toBe(person.Email);

        new PersonRepository().Delete(a);

    },100000)
})