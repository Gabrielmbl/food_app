const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.JWT_SECRET || 'your_secret_key'; 

const verifyToken0 = (req,res,next) => {
  const authHeader = req.headers.token;
  
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT, (err, user) => {
      if (err) res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
   };


const verifyToken = (req,res,next) => {
    const token = req.cookies.jwt 
    
    if (token) {
      
        jwt.verify(
            token,
            secretKey,
            async (err, decodedToken) => {
                if(err) {
                    res.status(403).json({errors:true, message:"Token is not valid!"});
                    //next();
                } else {
                    req.user = decodedToken.id;
                    next();                  
                }
            }
        );


    } else {
      return res.status(401).json({errors:true, message:"You are not authenticated!"});
    }
     };
  
     module.exports = {verifyToken};