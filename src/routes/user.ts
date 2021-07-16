import express, { Request, Response, Router } from "express"
import { PrismaClient } from '.prisma/client'
import { prisma, User } from "@prisma/client";

import { read } from "fs";
import bcrypt from "bcrypt"

const {user} = new PrismaClient()
const userRouter : express.Router = express.Router()

userRouter.get("/",async (req:Request,res:Response) =>{
    res.send("user root")
});

userRouter.get("/getall",async (req:Request,res:Response) =>{
    const users =await user.findMany({
        select: {
            id : true,
            password: true,
            email: true,
            name: true
        }
    })
    res.json(user)
});
userRouter.post("/getOne", async (req:Request,res:Response) =>{

    const{email} = req.body
    const userExist = await user.findUnique({
        where: {
            email
        },
        select :{
            email:true,
            password: true,
            name: true,
            id:true
        }
    })

    if(!userExist){
        return res.status(400).json({
            msg: "user doesn't"
        })
    }

    
    res.json(userExist)

});

userRouter.post("/join", async (req:Request,res:Response) =>{
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
        return res.status(400).json({
            msg: "user already exists"
        })
    }
    const encryptedPassowrd = bcrypt.hashSync(password, 10)

    const newUser = await user.create({
        data : {
            password:encryptedPassowrd,
            email,
            name
        }
    })
    res.json(newUser)

});

userRouter.post("/update", async (req:Request,res:Response) =>{
    console.log("/api/user/update")
    console.log(req.body)

    const{email, password, newPassword, newName} = req.body
    const userExist = await user.findUnique({
        where: {
            email
        },
        select :{
            password:true
        }
    })

    if(!userExist){
        return res.status(400).json({
            msg: "user doesn't exit"
        })
    }
    const encryptedPassowrd = bcrypt.hashSync(password, 10)
    if(bcrypt.compareSync(password,userExist.password)){
        const updateUser = await user.update({
            where:{
                email
            },
            data:{
                password: encryptedPassowrd,
                name: newName
            }
        })
        res.status(200).json(updateUser)
        //res.status(200).json({msg:"test msg"})
    }
    else{
        res.status(401).json({msg: "wrong password"})
    }

 

});

userRouter.post("/unroll", async (req:Request, res:Response)=>{
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
        return res.status(400).json({
            msg: "user doesn't exist"
        })
    }
    if(bcrypt.compareSync(password,userExist.password)){
        const deleteUser = await user.delete({
            where : {
                email
            }
        })
        console.log(deleteUser)
        res.status(200).json({msg : "deleted"})
    }else{
        res.status(401).json({msg : "password incorrect"})
    }
})


export = userRouter