import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
//import { validate } from "class-validator";
import config from "../config/config";
import { PrismaClient } from '.prisma/client'
import bcrypt from "bcrypt"

const {user} = new PrismaClient()

class AuthController { 
  static login = async (req: Request, res: Response) => {
    //Check if username and password are set
    

    let { email, password } = req.body;
    if (!(email && password)) {
      res.status(400).send();
    }
    
    //Get user from database 
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
            msg: "user doesn't exit"
        })
    }

    //Check if encrypted password match
    if (!bcrypt.compareSync(password,userExist.password)) {
      res.status(401).send();
      console.log("password no match")
      return;
    }

    //Sing JWT, valid for 1 hour
    const token = jwt.sign(
      { userEmail: userExist.email, name: userExist.name },
      config.jwtSecret,
      { expiresIn: "1h" }
    );

    //Send the jwt in the response
    res.send(token);
  };

  static changePassword = async (req: Request, res: Response) => {
    //Get ID from JWT
    const email = res.locals.jwtPayload.userEmail;
    console.log("changePassword Start")
    console.log(email)

    //Get parameters from the body
    const { oldPassword, newPassword } = req.body;
    if (!(oldPassword && newPassword)) {
      res.status(400).send();
    }

    //Get user from the database
    
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
     

    if (!userExist) {
        console.log("user doesnt exist")
        return res.status(400).send()
    }

    //Check if old password matchs
    const encryptedPassowrd = bcrypt.hashSync(newPassword, 10)
    if (!bcrypt.compareSync(oldPassword, userExist.password)) {
      res.status(401).send();
    }else{
        const updateUser = await user.update({
            where:{
                email
            },
            data:{
                password: encryptedPassowrd,
            }
        })
        res.status(200).json(updateUser)        
    }

  };
}
export default AuthController;