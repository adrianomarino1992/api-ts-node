import { IPerson } from "./Iperson";
import IRepository from "./Irepository";

export default interface IPersonRepository<T extends IPerson> extends IRepository<T>
{

} 