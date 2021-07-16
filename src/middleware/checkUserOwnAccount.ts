import {Request, Response, NextFunction} from "express"
import { PrismaClient } from '.prisma/client'
import * as jwt from "jsonwebtoken";
import config from "../config/config";

const {account} = new PrismaClient()



export const checkUserOwnAccount = async (req: Request, res: Response, next: NextFunction)  => {
    const token = <string>req.headers["authorization"];
    let jwtPayload =<any>jwt.verify(token, config.jwtSecret);
    const {userId} = jwtPayload;

    const {accountId} = req.params;
    console.log("target error start")
    const acct = await account.findUnique({
        where :{
            id: +accountId
        },
        select:{
            id:true
        }
    })

    console.log(acct)

    if(!acct){
        res.json({
            ok: false,
            error: "no such accountId"
        })
        return
    }
    console.log(acct.id);console.log(+accountId);
    if(acct.id==+accountId){
        next()
    }else{
        res.json({
            ok: false,
            error: "account owner is not userId"
        })
    }

    

    
};