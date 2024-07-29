const authRouter=require("./auth")
const userRouter=require("./user")
const accountRouter=require("./account")
const accountTypeRouter=require("./accountType")
const transactionsRouter=require("./transactions")

const route=(app)=>{
    app.use("/v1/auth",authRouter)
    app.use("/v1/user",userRouter)
    app.use("/v1/account",accountRouter)
    app.use("/v1/accountType",accountTypeRouter)
    app.use("/v1/transaction",transactionsRouter)
}
module.exports=route