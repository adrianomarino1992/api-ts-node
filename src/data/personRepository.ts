import 'reflect-metadata';
import Repository from "./repository";
import { PersonDTO } from "./dto/personDTO";
import { MetadataKeys } from "../decorators/validatorHandler";
import IPersonRepository from "../models/interfaces/IpersonRepository"


export default class PersonRepository extends Repository<PersonDTO> implements IPersonRepository<PersonDTO>
{
    constructor(){
        super(Reflect.getMetadata(MetadataKeys.PrismaCollectionKey, PersonDTO));
        
    }

}