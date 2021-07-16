
import { PrismaClient } from '.prisma/client'

const {user} = new PrismaClient()

const doesUserExist = async (userId:Number)=>{
    const userExist = await user.findUnique({
        where: {
            id: parseInt(String(userId))
        },
        select :{
            email:true
        }
        })

    if(userExist){
        return true;
    }else{
        return false;
    }
}

export = doesUserExist