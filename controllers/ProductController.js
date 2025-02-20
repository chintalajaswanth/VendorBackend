const Product=require("../models/Product")
const Firm=require("../models/Firm")

const multer=require("multer") 
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads/"); 
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
  });
  const upload = multer({ storage: storage });

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

        firm.products.push(savedProduct)
        await firm.save()

        res.status(200).json(savedProduct)

    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})

    }
}
const getProductByFirm=async(req,res)=>{
    try {
        const firmId=req.params.firmId;

        const firm =await Firm.findById(firmId)

        if(!firm)
        {
            return res.status(404).json({error:"No Firm Found"})
          

        }
        const restaurentname=firm.firmName;
        const products=await Product.find({firm:firmId})
        res.status(200).json({restaurentname,products});
        
    } catch (error) {
        console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}
  const deleteProductById=async(req,res)=>{
    try {
        const prouctId=req.params.productId;
        const deleteProduct=await Product.findByIdAndDelete(prouctId)

        if(!deleteProduct)
        {
            return res.status(404).json({error:"no product found"})


        }
    } catch (error) {
         console.log(error)
        res.status(500).json({error:"Internal server error"})
    }
}
module.exports={addproduct:[upload.single('image'),addproduct],getProductByFirm,deleteProductById}
