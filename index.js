const express=require("express")
const dotenv=require("dotenv")
const mongoose=require("mongoose");
const vendorRoutes=require("./routes/VendorRoutes")
const firmRoutes=require("./routes/Firmroutes")
const bodyParser=require("body-parser")
const productRoutes=require("./routes/ProductRoutes");


const path=require("path")
const cors=require("cors")
const app=express()
const PORT=process.env.PORT||4000;

dotenv.config()
app.use(cors())
mongoose.connect(process.env.MONGO_URL).
then(()=>console.log("mongodb connected successfully"))
.catch((error)=>console.log(error));

app.use(bodyParser.json());
app.use('/vendor',vendorRoutes)
app.use('/firm',firmRoutes)
app.use('/product',productRoutes)
app.use("/uploads",express.static('uploads'));
app.listen(PORT,()=>console.log(`server started running at ${PORT}`))


app.use("/",(req,res)=>
{
    res.send("<h1> Welcome to jazz</h1>");
})

