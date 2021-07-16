import express, { NextFunction, Request, Response } from 'express'
import { PrismaClient } from '.prisma/client'
import bodyParser, { json } from 'body-parser'
import path from 'path'
import http from 'http'
import routes from './routes'
import userRouter from './routes/user'
import authRouter from "./routes/auth"

const app:express.Express= express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.PORT || 80);

app.get('/',(req:Request,res:Response ,next:NextFunction)=>{
    res.send('Hello, Bank')
})



//connecting to router
app.use("/", routes);
//app.use('/api/user',userRouter)
//app.use('/auth',authRouter)

http.createServer(app).listen(app.get('port'), function(){
    console.log(app.get('port') + "에서 express 실행 중");
});


