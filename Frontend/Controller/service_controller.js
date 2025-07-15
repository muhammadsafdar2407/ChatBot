const db=require('../db')

const get_all_services=async(req,res)=>{
    const {buisness_id,parent_service_id}=req.query
    try{
      if(!buisness_id){
        return res.status(400).json({message: "Buisness id is required"})
    }
        let result
    if(parent_service_id===null || parent_service_id==="null" || parent_service_id===undefined){

        result=await db.query(
            'select * from services where business_id=$1 and parent_service_id is null',
            [buisness_id]
        )
    }
    else{
        result=await db.query(
            'select * from services where business_id=$1 and parent_service_id=$2',
            [buisness_id,parent_service_id]
        )
    }
    if(result.rows.length===0){
        return res.status(200).json({message: "your request for has been forwarded to the respective department. Rest assured your issue would be resolved shortly"})

    }
    return res.status(200).json({message: "Services Fetched successfully",services: result.rows})
}
catch(err){
    return res.status(500).json({error:"Failed to fetch services",details: err.message})
}

}

module.exports=get_all_services