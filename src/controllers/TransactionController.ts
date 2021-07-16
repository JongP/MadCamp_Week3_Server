import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { PrismaClient } from '.prisma/client'

const {user,account,transaction} = new PrismaClient()

class TransactionController {
    static income = async (req: Request, res: Response)=>{
        const {accountId} = req.params
        const {amount,category} = req.body

        if(+amount<0){
            res.json({
                ok:false,
                error: "amount should not be below zero"
            })
            return
        }

        try{
            const trans = await transaction.create({
                data : {
                    accountId: +accountId,
                    type: "INCOME",
                    amount: +amount,
                    category: +category,
                    accountSubId: +accountId
                }
            })
        }catch(error){
            res.json({
                ok:false,
                error: error
            })
            return
        }

        const acct = await account.findUnique({
            where :{
                id: +accountId
            },
            select:{
                balance:true
            }
        })
        if(!acct){
            res.json({
                ok:false,
                error: "no such accountId"
            })
            return
        }

        const newBalance= (+amount)+ acct.balance

        try{
            const acct = await account.update({
                where:{
                    id: +accountId
                },
                data:{
                    balance: newBalance
                }

            })
        }catch(error){
            res.json({
                ok:false,
                error: "account update failed"
            })
            return
        }
        res.json({
            ok:true
        })
    }
}


export default TransactionController;