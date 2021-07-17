import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { PrismaClient, Transaction } from '.prisma/client'
import { AcctType } from "@prisma/client";

const prisma = new PrismaClient();

const {user,account,transaction, $transaction} = new PrismaClient()

class TransactionController {
    static income = async (req: Request, res: Response)=>{
        const token = <string>req.headers["authorization"];
        let jwtPayload;
        try {
          jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        } catch (error) {
          res.status(200).json({
            ok: false,
            error: "invalid token"
          });
          return;
        }//do I need this?
        const { userId } = jwtPayload
        const {accountId} = req.params
        const {amount,categoryId,content} = req.body

        if(!(amount&&categoryId)){
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
                    category: +categoryId,
                    accountSubId: +accountId,
                    content,
                    userId: +userId
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
        const token = <string>req.headers["authorization"];
        let jwtPayload;
        try {
          jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        } catch (error) {
          res.status(200).json({
            ok: false,
            error: "invalid token"
          });
          return;
        }//do I need this?
        const { userId } = jwtPayload
        const {accountId} = req.params
        const {amount,categoryId,content} = req.body
        if(!(amount&&categoryId)){
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
                    category: +categoryId,
                    accountSubId: +accountId,
                    content,
                    userId: +userId
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
        const {amount,categoryId,accountSubId,content} = req.body

        if(!(amount&&categoryId&&accountSubId)){
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
                version:true,
                userId:true
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
                version:true,
                userId:true
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
                error:"not enough balance"
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
                    category: +categoryId,
                    accountSubId: +accountSubId,
                    content,
                    userId:acct.userId
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
                    category: +categoryId,
                    accountSubId: +accountId,
                    content,
                    userId:acctSub.userId
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

    static historyByMonth = async (req:Request, res: Response)=>{
        const token = <string>req.headers["authorization"];
        let jwtPayload;
        try {
          jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        } catch (error) {
          res.status(200).json({
            ok: false,
            error: "invalid token"
          });
          return;
        }//do I need this?
        const { userId } = jwtPayload

        const {year, month} = req.query
        if(!(year&&month)){
            res.json({ok:false,error:"wrong http query"})
            return
        }

        const date = year+"-"+month
        let nextDate
        if(month!="12"){
            nextDate = year+"-"+String((parseInt(String(month))+1))
        }else{
            nextDate = String(parseInt(String(year))+1)+"-1"
        }
        /*const test = new Date(date);
        const testNExt = new Date(nextDate)
        console.log(test)
        console.log(testNExt)*/

        const getAccounts = await user.findUnique({
            where:{
                id : +userId
            },
            include:{
                transactions:{
                    where:{
                        createdAt :{
                            gt : new Date(date),
                            lt : new Date(nextDate) //have to check
                        }
                    }
                }
            }
        })
        if(!getAccounts){
            res.json({ok:false,error:"wrong userId"})
            return
        }
        res.json({
            ok:true,
            response: getAccounts.transactions
        })
    }

    static historyGroupByCategory = async (req:Request, res: Response)=>{
        const token = <string>req.headers["authorization"];
        let jwtPayload;
        try {
          jwtPayload = <any>jwt.verify(token, config.jwtSecret);
        } catch (error) {
          res.status(200).json({
            ok: false,
            error: "invalid token"
          });
          return;
        }//do I need this?
        const { userId } = jwtPayload

        const {year, month} = req.query
        if(!(year&&month)){
            res.json({ok:false,error:"wrong http query"})
            return
        }

        const date = year+"-"+month
        let nextDate
        if(month!="12"){
            nextDate = year+"-"+String((parseInt(String(month))+1))
        }else{
            nextDate = String(parseInt(String(year))+1)+"-1"
        }

        const getTransactions = await transaction.groupBy({
            by:["type","category"],
            where:{
                userId:+userId,
                createdAt :{
                    gt : new Date(date),
                    lt : new Date(nextDate) //have to check
                }
            },
            _sum:{
                amount:true
            }, 
            orderBy:{
                _sum:{
                    amount:"desc"
                }
            } 

        })

        /*const getAccounts = await user.findUnique({
            where:{
                id : +userId
            },
            include:{
                transactions:{
                    where:{
                        createdAt :{
                            gt : new Date(date)
                        }
                    },
                    select:{
                        category:true,
                        amount :true
                    }
                }
            }
        })
        if(!getAccounts){
            res.json({ok:false,error:"wrong userId"})
            return
        }*/
        res.json({
            ok:true,
            response: getTransactions
        })
    }
}


export default TransactionController;