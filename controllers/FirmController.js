const Firm=require("../models/Firm")
const path=require("path")
const Vendor=require("../models/vendor")
const multer=require("multer")
    
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage: storage });
const addFirm=async(req,res)=>{
    try{
    const {firmName,area,category,region,offer}=req.body
    

    const image=req.file?req.file.filename:undefined;

      
      
    const vendor=await Vendor.findById(req.vendorId)

    if(!vendor)
    {
        res.status(404).json({message:"Vendor not found"})
    }
    const firm=new Firm({
        firmName,area,category,region,offer,image,vendor:vendor._id
    })

    await firm.save();
     const savedFirm=await firm.save();
    vendor.firm.push(savedFirm)

    await vendor.save();

    return res.status(200).json({message:"Firm added success fully"})
}
catch(error)
{
console.log(error)
res.status(500).json({error:"Internal server error"})
}

}

const addproduct=async(req,res)=>{
    try {
        const {productName,price,category,bestseller,decsription}=req.body
        const image=req.file? req.file.filename:undefined;

       const firmId=req.params.firmId;

       const firm=await Firm.findById(firmId);

       if(!firm)
       {
        return res.status(404).json({error:"No firm Found"})
       }

       const product=new Product({
        productName,price,category,bestseller,decsription,image,firm:firm._id
       })
        const savedProduct=await product.save();

        firm.product.push(savedProduct)
        await firm.save()

        res.status(200).json(savedProduct)

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})

    }
}
const deleteFirmById=async(req,res)=>{
    try {
        const FirmId=req.params.FirmId;
        const deleteFirm=await Firm.findByIdAndDelete(FirmId)

        if(!deleteFirm)
        {
            return res.status(404).json({error:"no Firm found"})


        }
    } catch (error) {
         console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}


module.exports={addFirm:[upload.single('image'),addFirm],deleteFirmById}
