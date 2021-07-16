import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from "../config/config";
import { PrismaClient } from '.prisma/client'

const {user,account,transaction} = new PrismaClient()

class TransactionController { 
    

}
export default TransactionController;