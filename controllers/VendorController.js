const Vendor=require("../models/vendor")
const jwt=require("jsonwebtoken")
const bcrypt=require("bcryptjs")
const dotenv=require("dotenv")
dotenv.config();
const secretKey=process.env.WhatIsYourName||"MyNameIsjazz";
const vendorRegister=async(req,res)=>{
    const {username,email,password}=req.body;
    try{
        const vendorEmail=await Vendor.findOne({email})
        if(vendorEmail)
        {
            return res.status(400).json("email already taken")
        }
        const hashPassword=await bcrypt.hash(password,10)
        const newVendor=new Vendor({
            username,
            email,
            password:hashPassword
        })
        await newVendor.save();
        res.status(201).json({message:"vendor registered succefully"});
        console.log("registered")
    }catch(error)
    {
  res.status(500).json({error:"Internal server error"})
  console.log(error);
    }
}


const vendorLogin=async(req,res)=>
{
    const {email,password}=req.body;

    try{
        const vendor=await Vendor.findOne({email})
        if(!vendor || !(await bcrypt.compare(password,vendor.password)))
        {
            return res.status(401).json({error:"invlaid username or password"})
        }
        const token=jwt.sign({vendorId:vendor._id},secretKey,{expiresIn:"1h"})


           const vendorId=vendor._id;

        res.status(201).json({success:"successfully login",token,vendorId})
 console.log(email,"this is token",token);
   }
catch(error)
{
 console.log("error occuredd",error)   
}


}

const getAllVendors=async(req,res)=>{
    try{
      const vendors=await Vendor.find().populate('firm')
      res.json({vendors})
    }catch(error)
    {
   console.log(error);
   res.status(500).json({error:"Internal server error"})
    }
}

const getVendorById=async(req,res)=>
{
    const vendorId=req.params.id;
    try{
     const vendor=await Vendor.findById(vendorId).populate('firm');
     if(!vendor)
     {
        console.log(error);
        return res.status(404).json({error:"vendor not found"})

     }
     const vendorFirmId=vendor.firm[0]._id;

     res.status(200).json({vendor,vendorFirmId})

    }catch(error)
    {
        console.log(error);
        res.status(500).json({error:"Internal server error"})
    }
}
module.exports={vendorRegister,vendorLogin,getAllVendors,getVendorById}