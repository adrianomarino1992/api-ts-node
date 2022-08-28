import { Action, Controller, HttpVerb, Use } from "../decorators/controller.decorators";
import IEventRepository from '../models/interfaces/IeventRepository'
import EventRepository from '../data/eventRepository';
import { PersonDTO } from "../data/dto/personDTO";
import { EventDTO } from "../data/dto/eventDTO";
import { Verb } from "../enums/httpVerbs";
import { AuthenticationHandler } from "../middlewares/authenticationHandler";
import { IEvent } from "../models/interfaces/Ievent";
import { Exception } from "../app/app";
import BaseController from "./baseController";
import DuplicateKeyException from "../exceptions/duplicateKeyException";
import IPersonRepository from "../models/interfaces/IpersonRepository";
import PersonRepository from "../data/personRepository";

@Controller("/events")
@Use(AuthenticationHandler)
@Use((req, _) => { req.headers["middleware"] = "we can add many middlewares easily" })
class EventController extends BaseController
{
    private _rep : IEventRepository<EventDTO, PersonDTO>;
    private _repPer : IPersonRepository<PersonDTO>;

    constructor()
    {
        super();
        this._rep = new EventRepository();
        this._repPer = new PersonRepository();
    }

    @HttpVerb(Verb.GET)
    @Action("GetByOwner", "ownerId")
    public async GetByOwner(ownerId : string): Promise<EventDTO[]>
    {        
        return await this._rep.GetByOwner(this._validarId(ownerId));    
    }

    @HttpVerb(Verb.GET)
    @Action("GetByParticipant", "partId")
    public async GetByParticipant(partId : string): Promise<EventDTO[]>
    {        
        return await this._rep.GetByParticipant(this._validarId(partId));
    }

    @HttpVerb(Verb.GET)
    @Action("getAll")
    public async GetAll(): Promise<EventDTO[]>
    {        
        return await this._rep.Get({include : { Owner : true, Participants : true}, orderBy: [ {Date : "desc"}, {Title : "asc"}]});
    }

    @HttpVerb(Verb.GET)
    @Action("getBytitle", "title")
    public async GetByTitle(title : string): Promise<EventDTO[]>
    {        
        return await this._rep.Get({ where : { Title : title }, include : { Owner : true, Participants : true}});
    }

    @HttpVerb(Verb.GET)
    @Action("getById", "id")
    public async GetById(id : string): Promise<EventDTO[]>
    {        
        let i : Number = Number.parseInt(id);

        if(Number.isNaN(i))
            throw new Exception("The id must be a valid int32 number"); 

        if( i < 0)
            throw new Exception("The id must be greater than zero")

        return await this._rep.Get({ where : { Id : i }, include : { Owner : true, Participants : true}});
    }

    @HttpVerb(Verb.GET)
    @Action("getByDate", "date")
    public async GetByDate(date : string): Promise<EventDTO[]>
    {        
        let dt : Date = new Date(date);

        return await this._rep.GetByDate(dt);
    }

    @HttpVerb(Verb.GET)
    @Action("getByDateRange", "dates")
    public async GetByDateRange(dates : string[]): Promise<EventDTO[]>
    {        
        let dtInit : Date = new Date(dates[0]);
        let dtOver : Date = new Date(dates[1]);
        return await this._rep.GetByDateRange(dtInit, dtOver);
    }

    @HttpVerb(Verb.POST)
    @Action("add", "event")
    public async Add(event : IEvent): Promise<void>
    {  
        let eventDTO : EventDTO = new EventDTO(event);

        let evt = await this._rep.GetByDate(eventDTO.Date);

        if(evt && evt.length > 0)
        {
            throw new DuplicateKeyException("Already exists a event to this date");
        }

        await this._rep.Add(eventDTO);
    }

    @HttpVerb(Verb.POST)
    @Action("addPart", "data")
    public async AddPart(data : any[]): Promise<void>
    {  
        let eventDTO : EventDTO = new EventDTO(data[0]);
        let personDTO : PersonDTO = new PersonDTO(data[1]);
        await this._rep.AddParticipant(eventDTO, personDTO);
    }


    @HttpVerb(Verb.POST)
    @Action("removePart", "data")
    public async RemovePart(data : any[]): Promise<void>
    {  
        let eventDTO : EventDTO = new EventDTO(data[0]);
        let personDTO : PersonDTO = new PersonDTO(data[1]);
        await this._rep.RemoveParticipant(eventDTO, personDTO);
    }

    @HttpVerb(Verb.PUT)
    @Action("update", "event")
    public async Update(event : IEvent): Promise<void>
    {        
        let eventDTO : EventDTO = new EventDTO(event);

        let evt = await this._rep.GetByDate(eventDTO.Date);

        if(evt && evt.length > 0 && evt[0].Id != event.Id)
        {
            throw new DuplicateKeyException("Already exists a event to this date");
        }

        await this._rep.Update(eventDTO);
    }

    @HttpVerb(Verb.DELETE)
    @Action("delete", "event")
    public async Delete(event : IEvent): Promise<void>
    {        
        let eventDTO : EventDTO = new EventDTO(event);

        for(let s of event.Participants)
        {
            let person : PersonDTO = new PersonDTO((await this._repPer.Get({where : {Id : s.PersonId}}))[0]);

           await this._rep.RemoveParticipant(eventDTO, person);
        }
       

        await this._rep.Delete(eventDTO);
    }

    private _validarId(id : string) : number
    {
        let i : number = Number.parseInt(id);

        if(Number.isNaN(i))
            throw new Exception("The id must be a valid int32 number"); 

        if( i < 0)
            throw new Exception("The id must be greater than zero")

        return i;
    }


}


export default EventController;