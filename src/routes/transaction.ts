import { Router } from "express";
import TransactionController from "../controllers/TransactionController";
import { checkJwt } from "../middleware/checkJwt";
import { checkUser } from "../middleware/checkUser";
import { checkUserOwnAccount } from "../middleware/checkUserOwnAccount";

const router = Router();
//Login route

router.post("/income/:accountId",[checkJwt,checkUser,checkUserOwnAccount],TransactionController.income)

router.post("/expenditure/:accountId",[checkJwt,checkUser,checkUserOwnAccount],TransactionController.expenditure)

router.post("/send/:accountId",[checkJwt,checkUser,checkUserOwnAccount],TransactionController.send)

router.get("/history",[checkJwt,checkUser],TransactionController.historyByMonth)

router.get("/historyByCategory",[checkJwt,checkUser],TransactionController.historyGroupByCategory)

router.get("/historyByCreatedAt",[checkJwt,checkUser],TransactionController.historyByMonthTest)

export default router;