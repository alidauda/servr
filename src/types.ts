import {  IDatabaseDriver, Connection,EntityManager  } from "@mikro-orm/core";
import { Redis } from "ioredis";
import {Request,Response} from "express";

export class MyContext{
    em:EntityManager<IDatabaseDriver<Connection>>
    req:Request & { session: { userId: number } }
    res:Response
    redis:Redis
}