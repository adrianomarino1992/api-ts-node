

export default interface IRepository<T>
{
    Add(obj : T) : Promise<T>;

    Update(obj: T) : Promise<void>;

    Get(args? : any) : Promise<T[]>;

    Refresh(obj: T) : Promise<T>;

    Delete(obj : T) : Promise<void>;
}