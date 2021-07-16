import { Router, Request, Response } from "express"
import auth from "./auth"
import user from "./user"
import acct from "./acct"

const routes = Router()

routes.use("/auth", auth)
routes.use("/api/user", user)
routes.use("/acct",acct)

export default routes