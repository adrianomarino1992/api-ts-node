import { Map } from "../../decorators/prisma.decorators";
import { Person } from "../../models/person";
import { IPerson } from "../../models/interfaces/Iperson";
import IPrismaConvertible from '../dto/IprismaObject';

@Map("person")
export class PersonDTO extends Person implements IPrismaConvertible
{

    constructor(data : IPerson){
        super(data);
    }

    public ToCreateData() : any
    {
        return {
            Email: this.Email,
            Name: this.Name,
            Phone: this.Phone
          }
    }

    public GetUniqueKey() : any
    {
        return {
            Email : this.Email
        }
    }
    
}