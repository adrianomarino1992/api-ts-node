import "reflect-metadata";

import IRepository from "../models/interfaces/Irepository";
import { PrismaClient } from "@prisma/client";
import IPrismaConvertible from "./dto/IprismaObject";

export default class Repository<T extends IPrismaConvertible>
  implements IRepository<T>
{
  protected _cli: PrismaClient;

  private _collection: any;

  public CollectionName: string = "";

  constructor(col: string) {
    
    this._cli = new PrismaClient();

    this._collection = Reflect.get(this._cli, col);

    this.CollectionName = col;
  }

  public async Add(obj: T): Promise<T> {
    
    this._cli.$connect();

    try {
      let data: any = obj.ToCreateData();

      await this._collection.create({ data: data });

      return await this.Refresh(obj);
    } catch (ex) {
      this._cli.$disconnect();

      throw ex;
    }
  }

  public async Update(obj: T): Promise<void> {
    try {
      let where: any = obj.GetUniqueKey();
      let data: any = obj.ToCreateData();

      await this._collection.update({ where: where, data: data });
    } catch (ex) {
      this._cli.$disconnect();

      throw ex;
    }
  }

  async Get(args?: any): Promise<T[]> {
    return await this._collection.findMany(args);
  }

  async Refresh(obj: T): Promise<T> {
    try {
      return (await this._collection.findFirst({
        where: obj.GetUniqueKey(),
      })) as unknown as T;
    } catch (ex) {
      this._cli.$disconnect();

      throw ex;
    }
  }

  async Delete(obj: T): Promise<void> {
    let where: any = obj.GetUniqueKey();

    try {
      await this._collection.delete({ where: where });
    } catch (ex) {
      this._cli.$disconnect();

      throw ex;
    }
  }
}
