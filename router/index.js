const authRouter=require("./auth")
//const userRouter=require("./user")

const route=(app)=>{
    app.use("/v1/auth",authRouter)
}
module.exports=route