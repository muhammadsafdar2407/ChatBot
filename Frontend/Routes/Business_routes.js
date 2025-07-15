const express=require('express')
const get_all_buisness=require('../Controller/Buisness_Controller')
const buisness_router=express.Router();

buisness_router.get('/get_all_buisness', get_all_buisness)


module.exports=buisness_router;