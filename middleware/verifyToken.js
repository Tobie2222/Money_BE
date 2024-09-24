const jwt = require("jsonwebtoken") 
const dotenv = require("dotenv") 
dotenv.config();

  const verifyToken = (req,res,next) => {
    const tokenHeader = req.headers.token;
    if(!tokenHeader){
        return res.status(401).json({
            message: "Access denied. No token provided."
        })
    };
    
    const token = tokenHeader.split(" ")[1];
    jwt.verify(token,process.env.TOKEN_KEY, (err,user) => {
        if (err) return res.status(403).json({ message: "Token is invalid." });
        req.user = user;
        next();
    })
}

 const verifyUser = (req,res,next) => {
    verifyToken(req,res,() => {
        if (req.user && req.user.id === parseInt(req.params.userId)) {
            next();
        } else {
            return res.status(403).json({message: "You are not allowed to do that!"})
        }
    })
 }

const verifyAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user && req.user.isAdmin){
            next();
        } else {
            return res.status(403).json({message: "Admin access required."})
        }
    })
}