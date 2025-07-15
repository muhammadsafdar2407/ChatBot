const get_all_services=require('../Controller/service_controller')

const express=require('express')

const service_router=express.Router();

service_router.get('/get_all_services',get_all_services)

module.exports=service_router