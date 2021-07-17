import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { PrismaClient } from '.prisma/client'
import { AcctType } from "@prisma/client";

const prisma = new PrismaClient();

const {account,transaction, $transaction} = new PrismaClient()

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

        const acct =  await account.findUnique({
            where :{
                id: +accountId
            },
            select:{
                balance:true,
                version:true
            }
        })
        if(!acct){
            res.json({
                ok:false,
                error: "no such accountId"
            })
            return
        }

        const newBalance= acct.balance + (+amount)

        let newAcct
        try{
            newAcct = account.updateMany({
                where:{
                    id: +accountId,
                    version: acct.version
                },
                data:{
                    balance: newBalance,
                    version: {
                        increment: 1
                    },
                }

            })
        }catch(error){
            res.json({
                ok:false,
                error: "account update failed"
            })
            return
        }

        let trans;
        try{
            trans = transaction.create({
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

        prisma.$transaction([newAcct, trans])
        

        res.json({
            ok:true
        })
    }

    static expenditure = async (req: Request, res: Response)=>{
        const {accountId} = req.params
        const {amount,category} = req.body

        if(+amount<0){
            res.json({
                ok:false,
                error: "amount should not be below zero"
            })
            return
        }

        const acct =  await account.findUnique({
            where :{
                id: +accountId
            },
            select:{
                balance:true,
                version:true
            }
        })
        if(!acct){
            res.json({
                ok:false,
                error: "no such accountId"
            })
            return
        }

        const newBalance= acct.balance - (+amount)
        if(newBalance<0){
            res.json({
                ok:false,
                error: "not enought balance"
            })
            return
        }

        let newAcct
        try{
            newAcct = account.updateMany({
                where:{
                    id: +accountId,
                    version: acct.version
                },
                data:{
                    balance: newBalance,
                    version: {
                        increment: 1
                    },
                }

            })
        }catch(error){
            res.json({
                ok:false,
                error: "account update failed"
            })
            return
        }

        let trans;
        try{
            trans = transaction.create({
                data : {
                    accountId: +accountId,
                    type: "EXPENDITURE",
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
            return//do I need this??
        }

        prisma.$transaction([newAcct, trans])
        

        res.json({
            ok:true
        })
    }
}


export default TransactionController;