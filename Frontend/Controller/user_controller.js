const db=require('../db')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

const secret_key=process.env.JWT_SECRET 

const signup = async (req,res)=>{
    const{name,email,password,pin}=req.body;
try{
    const hashed_password=await bcrypt.hash(password,10)

    const result= await db.query(
        'INSERT into users (name,email,password,pin) Values ($1,$2,$3,$4) RETURNING id,name,email',
        [name,email,hashed_password,pin]
    )
    const user=result.rows[0]
    const token=jwt.sign({
        id: user.id,
        email: user.email

    },secret_key,{expiresIn:"1h"})

    res.status(201).json({message: 'User created Success ',user: result.rows[0],token})
}
catch(err){
    res.status(500).json({error: 'signupfailed',details: err.message})
}
};


const login = async (req,res)=>{
    const {email,password}=req.body;
    console.log(email,password)
    try{
        const result=await db.query(
            'select * from users where email=$1',
            [email]
        )
        console.log(result.rows[0])
        const user=result.rows[0]
        if(await bcrypt.compare(password,user.password)){
            const token=jwt.sign({
                id: user.id,
                email: user.email    
            },secret_key,{expiresIn: '1h'})
            res.json({message: 'Login Successful',token})
        }
        else{
            res.status(401).json({error:"Invalid email or password"});
        }
    } 
    catch(err){
        res.status(500).json({error: "Login failed",details: err.message})
    }
}


const verify_pin = async (req,res) =>{
    const {pin} = req.body
    const id=req.user.id
    pin.toString()
    console.log(pin, typeof pin)
    try{

    const result=await db.query(
            'select * from users where id=$1',
            [id]
        )   
    const fetch_user=result.rows[0]
    console.log(fetch_user)
    if(fetch_user.pin==pin){
        return res.status(200).json({ message: "pin verified"})
    }    
    else{
        return res.status(401).json({ error :"invalid Pin entered"})
    }
}
catch(err){
    return res.status(500).json({error: "Pin verification failed", details: err.message})
}    

}

module.exports={signup,login,verify_pin}