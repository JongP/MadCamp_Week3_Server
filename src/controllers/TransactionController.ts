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

        if(!(amount&&category)){
            res.json({
                ok:false,
                error: "null parameter"
            })
            return
        }

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
        if(!(amount&&category)){
            res.json({
                ok:false,
                error: "null parameter"
            })
            return
        }
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
    static send = async (req: Request, res: Response)=>{
        const {accountId} = req.params
        const {amount,category,accountSubId} = req.body

        if(!(amount&&category&&accountSubId)){
            res.json({
                ok:false,
                error: "null parameter"
            })
            return
        }

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

        const acctSub =  await account.findUnique({
            where :{
                id: +accountSubId
            },
            select:{
                balance:true,
                version:true
            }
        })
        if(!acctSub){
            res.json({
                ok:false,
                error: "no such accountSubId"
            })
            return
        }

        const newBalance= acct.balance - (+amount)
        const newSubBalance = acctSub.balance + (+amount)
        if(newBalance<0){
            res.json({
                ok:false,
                error:"not enouhg balance"
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

        let newAcctSub;
        try{
            newAcctSub = account.updateMany({
                where:{
                    id: +accountSubId,
                    version: acctSub.version
                },
                data:{
                    balance: newSubBalance,
                    version: {
                        increment: 1
                    },
                }

            })
        }catch(error){
            res.json({
                ok:false,
                error: "accountSub update failed"
            })
            return
        }

        let trans;
        try{
            trans = transaction.create({
                data : {
                    accountId: +accountId,
                    type: "SEND",
                    amount: +amount,
                    category: +category,
                    accountSubId: +accountSubId
                }
            })
        }catch(error){
            res.json({
                ok:false,
                error: "trans create failed"
            })
            return
        }

        let transSub;
        try{
            transSub = transaction.create({
                data : {
                    accountId: +accountSubId,
                    type: "RECEIVE",
                    amount: +amount,
                    category: +category,
                    accountSubId: +accountId
                }
            })
        }catch(error){
            res.json({
                ok:false,
                error: "transSub create failed"
            })
            return
        }

        prisma.$transaction([newAcct,newAcctSub, trans, transSub])
        

        res.json({
            ok:true
        })
    }
}


export default TransactionController;