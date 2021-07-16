import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { PrismaClient } from '.prisma/client'
import { parse } from "path/posix";

const {user,account} = new PrismaClient()

class AccountController { 
    static createAccount = async (req: Request, res: Response) => {
        console.log("acct/create/:userId")
        let {name, type} = req.body
        let {userId}  = req.params

        if (!(name && type)) {
          res.json({
            ok: false,
            error: "null parameter",
          })
          return
        }

       try{
            const acct = await account.create({
                data : {
                    name,
                    type,
                    userId : +userId
                }
            })
            console.log(acct);
        }
        catch(error){
            res.json({
                ok:false,
                error:"create acct failed. maybe duplicate name or other problem in format"
            })
            return
        }
        
        res.json({
            ok:true
        })

    }

    static deleteAccount = async (req: Request, res: Response) => {
        console.log("acct/delete/:userId")
        let {accountId} = req.body
        let {userId}  = req.params

        if (!accountId) {
          res.json({
            ok: false,
            error: "null parameter"
          })
          return
        }

       
        const acct = await account.delete({
            where : {
                id: +accountId
            }
        })
        if(!acct){
            res.json({
                ok:false,
                error:"delete error. maybe no such id"
            })
        }else{
        res.json({
            ok:true
        })
    }

    }
    
    static getAllAccount = async (req: Request, res: Response) => {
        const{ userId} = req.params

        const accounts = await account.findMany({
            where :{
                userId : +userId
            }
        })

        res.json({
            ok:true,
            accounts
        })

        

    }
    

}
export default AccountController;