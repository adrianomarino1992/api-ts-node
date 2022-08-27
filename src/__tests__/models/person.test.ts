import {Person} from '../../models/person';
import { IPerson } from '../../models/interfaces/Iperson';
import {PersonDTO} from '../../data/dto/personDTO';

describe("Testing Person entity", ()=>{

    test("cTor", ()=>{

        let p : Person = new Person(
            {
                Email : "adriano.marino1992@gmail.com",
                Id : 123456,
                Name : "Adriano", 
                Phone : "12982068255", 
                Events : []
            } as IPerson)

        console.log(p);    

    })    


    test("Get Map metadata", ()=>{

        let u : PersonDTO = new PersonDTO(
            {
                Email : "adriano.marino1992@gmail.com",
                Id : 123456,
                Name : "Adriano", 
                Phone : "12982068255"
            } as IPerson);

        let c : string = Reflect.get(u, "_prismaCollectionName");
        
        expect(c).toBe("person");

    })

})