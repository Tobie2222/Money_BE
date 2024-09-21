// Middleware trong lập trình web, đặc biệt với Node.js và Express.js, 
// là một hàm có quyền truy cập vào đối tượng yêu cầu (req), đối tượng phản hồi (res), 
// và hàm tiếp theo trong chuỗi thực thi (next)
 const jwt = require("jsonwebtoken") // import thu vien jsonwebtoken
 const dotenv = require("dotenv") // import thu vien dotenv
 dotenv.config();

// Xac thuc token
  const verifyToken = (req,res,next) => {
    const tokenHeader = req.headers.token;
    if(!tokenHeader){
        return res.status(401).json({
            message: "Access denied. No token provided."
        })
    };
    // Tách token từ chuỗi "Bearer <token>"
    const token = tokenHeader.split(" ")[1];
    jwt.verify(token,process.env.TOKEN_KEY, (err,user) => {
        if (err) return res.status(403).json({ message: "Token is invalid." });
        req.user = user;
        next();
    })
}

//Xac thuc nguoi dung
 const verifyUser = (req,res,next) => {
    verifyToken(req,res,() => {
        if (req.user && req.user.id === parseInt(req.params.userId)) {
            next();
        } else {
            return res.status(403).json({message: "You are not allowed to do that!"})
        }
    })
 }

// Xac thuc admin
const verifyAdmin = (req,res,next) => {
    verifyToken(req,res,() => {
        if(req.user && req.user.isAdmin){
            next();
        } else {
            return res.status(403).json({message: "Admin access required."})
        }
    })
}