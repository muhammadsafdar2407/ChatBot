const jwt=require('jsonwebtoken')
const secret_key=process.env.JWT_SECRET

const authenticate = (req,res,next)=>{
    const auth_header=req.headers.authorization;

    if(!auth_header?.startsWith('Bearer')){
        return res.status(401).json({error: "no token provided"})
    }
    const token=auth_header.split(' ')[1];

    try{
        const decoded=jwt.verify(token,secret_key)
        req.user=decoded;
        next();
    }
    catch(err){
        return res.json(403).json({error: "Invalid token"});
    }
}

module.exports = authenticate;