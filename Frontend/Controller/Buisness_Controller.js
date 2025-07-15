const db=require('../db')


const get_all_buisness = async(req,res)=>{
    try{
        const result=await db.query(
            'select * from businesses'
        )
        return res.status(200).json({message: "Buisnsses Fetched Success",buisness: result.rows})
    }
    catch(err){
        return res.status(500).json({error: "Buisness Fetching failed",error: err.message})
    }
}

module.exports=get_all_buisness;