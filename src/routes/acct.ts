
import { Router } from "express";
import AccountController from "../controllers/AccountController";
import { checkJwt } from "../middleware/checkJwt";
import { checkUser } from "../middleware/checkUser";

const router = Router();
//Login route

router.post("/create/:userId",[checkJwt,checkUser],AccountController.createAccount)

router.post("/delete/:userId",[checkJwt,checkUser],AccountController.deleteAccount)

router.get("/getall/:userId",[checkJwt,checkUser],AccountController.getAllAccount)

export default router;