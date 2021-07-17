import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { PrismaClient } from '.prisma/client'
import bcrypt from "bcrypt"

const {user} = new PrismaClient()

class UserController { 
  static getAll = async (req: Request, res: Response) => {
    const users =await user.findMany({
        select: {
            id : true,
            password: true,
            email: true,
            name: true
        }
    })
    res.json(user)
  }
  
  static join =async (req:Request,res:Response) =>{
    console.log("/api/user/join")
    console.log(req.body)

    const{email, password, name} = req.body
    const userExist = await user.findUnique({
        where: {
            email
        },
        select :{
            email:true
        }
    })

    if(userExist){
        console.log("user exists")
        res.json({
            ok: false,
            error: "user already exists",
        })
        return
    }
    const encryptedPassowrd = bcrypt.hashSync(password, 10)

    const newUser = await user.create({
        data : {
            password:encryptedPassowrd,
            email,
            name,
            categories:{
                create:[
                    {name:"식비"},{name:"생활"},{name:"쇼핑"},{name:"교통"},{name:"의료/건강"},
                    {name:"문화/건강"},{name:"미분류"},{name:"월급",type:"INCOME"},
                    {name:"용돈",type:"INCOME"},{name:"기타 수입",type:"INCOME"}
                ]
            }
        }
    })
    res.json({ok:true})
  }

  static unroll = async (req:Request, res:Response)=>{
    console.log("/api/user/unroll")
    console.log(req.body)
    const{email, password} = req.body

    const userExist  = await user.findUnique({
        where: {
            email :email
        },
        select :{
            email:true,
            password:true
        }
    })

    if(!userExist){
        return res.json({
            ok: false,
            error: "user doesn't exist"
        })
    }
    if(bcrypt.compareSync(password,userExist.password)){
        const deleteUser = await user.delete({
            where : {
                email
            }
        })
        console.log(deleteUser)
        res.json({ok: true})
    }else{
        res.status(200).json({
            ok:false,
            error : "password incorrect"})
    }
  }

}
export default UserController;