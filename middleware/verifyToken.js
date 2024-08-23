const jwt=require("jsonwebtoken")
const dotenv=require("dotenv")
dotenv.config()

const verifyToken=(req,res,next)=>{
    const tokens=req.headers.token
    if (tokens) {
        const token=tokens.split(" ")[1]
        jwt.verify(token,process.env.TOKEN_KEY,(err,user)=>{
            if (err) return res.status(403).json({message: "token is not invalid!"})
            req.user=user
            next()
        })
    }
}
const verifyTokenUser=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if (req.user && (req.user.id===req.params.userId)) {
            next()
        } else {
            res.status(403).json({message: "you're not allow to do that 222!"})
        }
    })
}
const verifyTokenAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if (req.user && req.user.isAdmin) {
            next()
        } else {
            res.status(403).json({message: "you're not allow to do that!"})
        }
    })
}

module.exports={
    verifyTokenUser,
    verifyTokenAdmin
}