const Vendor=require("../models/vendor")
const jwt=require("jsonwebtoken")
const secretKey="MyNameIsJazz"
const verifyToken=async(req,res,next)=>
{

    const token=req.headers.token;

    if(!token)
    {
        return res.status(401).json({error:"Token is required"})


    }

    try{
        const decoded=jwt.verify(token,secretKey);

        const vendor=await Vendor.findById(decoded.vendorId)
        req.vendorId=vendor._id
        next()
    }
    catch(error)
    {
   console.log(error)
   return res.status(500).json({error:"Invalid token"})
    }
}

module.exports=verifyToken