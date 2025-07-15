const express=require('express')
const {signup}=require('../Controller/user_controller')
const {login,verify_pin}=require('../Controller/user_controller')
const authenticate=require('../Middleware/authenticator')

const userouter=express.Router()

userouter.post('/signup',signup)
userouter.post('/login',login)
userouter.post('/verifypin',authenticate,verify_pin)

module.exports=userouter