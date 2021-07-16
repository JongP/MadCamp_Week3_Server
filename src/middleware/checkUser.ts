import {Request, Response, NextFunction} from "express"
import { PrismaClient } from '.prisma/client'

const {user} = new PrismaClient()



export const checkUser = async (req: Request, res: Response, next: NextFunction)  => {

  const {userId} = req.params

  const userExist = await user.findUnique({
    where: {
        id: parseInt(userId)
    },
    select :{
        email:true
    }
    })

if(userExist){
    next()
}else{
    res.json({
      ok:false,
      error: "wrong userId in middle ware"
    })
}
};