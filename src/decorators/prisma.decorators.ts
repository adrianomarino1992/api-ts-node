import { MetadataKeys } from "./validatorHandler"
import 'reflect-metadata';

export function Map<T extends  { new (...args: any[]): {}}>(collection : string) : (constructor : T) => void
{
    const prismaMapSymbol = "ow:prismakey"

    MetadataKeys.PrismaCollectionKey = prismaMapSymbol;

    return (constructor : T) =>
    {
        Reflect.defineMetadata(prismaMapSymbol, collection, constructor);

        return class extends constructor
        {            
            _prismaCollectionName : string = collection
            
        }
    }
}