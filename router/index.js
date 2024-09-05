const authRouter=require("./auth")
const userRouter=require("./user")
const accountRouter=require("./account")
const accountTypeRouter=require("./accountType")
const transactionsRouter=require("./transactions")
const savingRouter=require("./saving")
const categoriesRouter=require("./categories")
const incomeTypeRouter=require("./incomeType")
const notificationRouter=require("./notification")

const route=(app)=>{
    app.use("/v1/auth",authRouter)
    app.use("/v1/user",userRouter)
    app.use("/v1/account",accountRouter)
    app.use("/v1/accountType",accountTypeRouter)
    app.use("/v1/transaction",transactionsRouter)
    app.use("/v1/saving",savingRouter)
    app.use("/v1/categories",categoriesRouter)
    app.use("/v1/incomeType",incomeTypeRouter)
    app.use("/v1/notification",notificationRouter)
}
module.exports=route