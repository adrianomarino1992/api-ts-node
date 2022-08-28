import { Action, Controller, HttpVerb, Use } from "../decorators/controller.decorators";
import IPersonRepository from '../models/interfaces/IpersonRepository'
import PersonRepository from '../data/personRepository';
import { PersonDTO } from "../data/dto/personDTO";
import { Verb } from "../enums/httpVerbs";
import { AuthenticationHandler } from "../middlewares/authenticationHandler";
import { IPerson } from "../models/interfaces/Iperson";
import { Exception } from "../app/app";
import BaseController from "./baseController";
import DuplicateKeyException from "../exceptions/duplicateKeyException";
import IEventRepository from "../models/interfaces/IeventRepository";
import { EventDTO } from "../data/dto/eventDTO";
import EventRepository from "../data/eventRepository";
import ConstraintException from "../exceptions/ConstraintException";

@Controller("/persons")
@Use(AuthenticationHandler)
@Use((req, _) => { req.headers["middleware"] = "we can add many middlewares easily" })
class PersonController extends BaseController
{
    private _rep : IPersonRepository<PersonDTO>;
    private _repEvt  : IEventRepository<EventDTO, PersonDTO>;

    constructor()
    {
        super();
        this._rep = new PersonRepository();
        this._repEvt = new EventRepository();
    }

    @HttpVerb(Verb.GET)
    @Action("getAll")
    public async GetAll(): Promise<PersonDTO[]>
    {        
        return await this._rep.Get({orderBy : [{Name : 'asc'}]});
    }    

    @HttpVerb(Verb.GET)
    @Action("getByEmail", "email")
    public async GetByEmail(email : string): Promise<PersonDTO[]>
    {        
        return await this._rep.Get({ where : { Email : email }});
    }

    @HttpVerb(Verb.POST)
    @Action("add", "person")
    public async Add(person : IPerson): Promise<void>
    {  
        let personDTO : PersonDTO = new PersonDTO(person);

        let p = await this._rep.Get({ where : { Email : personDTO.Email }});

        if(p != undefined && p.length > 0)
            throw new DuplicateKeyException("This email already exist on database");

        await this._rep.Add(personDTO);
    }

    @HttpVerb(Verb.PUT)
    @Action("update", "person")
    public async Update(person : IPerson): Promise<void>
    {        
        let personDTO : PersonDTO = new PersonDTO(person);

        await this._rep.Update(personDTO);
    }

    @HttpVerb(Verb.GET)
    @Action("getById", "id")
    public async GetById(id : string): Promise<PersonDTO[]>
    {                 

        let i : Number = Number.parseInt(id);

        if(Number.isNaN(i))
            throw new Exception("The id must be a valid int32 number"); 

        if( i < 0)
            throw new Exception("The id must be greater than zero")


        return await this._rep.Get({ where : { Id : i }});
    }

    @HttpVerb(Verb.DELETE)
    @Action("delete", "person")
    public async Delete(person : IPerson): Promise<void>
    {        
        let personDTO : PersonDTO = new PersonDTO(person);

        let events = await this._repEvt.GetByOwner(personDTO.Id);

        if(events && events.length > 0)
        {
            throw new ConstraintException(`This person is owner of "${events[0].Title}", delete this event before.`);
        }

        events = await this._repEvt.GetByParticipant(personDTO.Id);

        if(events && events.length > 0)
        {
            throw new ConstraintException(`This person is part of "${events[0].Title}", remove this person of the event before.`);
        }
        

        await this._rep.Delete(personDTO);
    }
}


export default PersonController;