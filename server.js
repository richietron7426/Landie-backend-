const express = require("express")
const multer = require('multer')
const cors = require('cors')
const path= require('path')


const app = express();
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(express.urlencoded({extended:true}))

const mongoose = require('mongoose')
const port = 8080;

const url = `mongodb+srv://Richietron:74267426%40Okon@richietron-7426.0pgvw.mongodb.net/`



//app.use(express.static("build"))



mongoose.connect(url)
          .then(() => {
          console.log("You have been connected to the database:", url);
         })
        .catch(err => {
        console.error("Database connection error:", err);
         });
         
         
app.get('/', (req,res)=>{
  res.sendFile(path.join(__dirname, 'get.html'));
})

 const propertySchema = mongoose.Schema(
   {
     title:String,
     discription:String,
     imageUrl : String,
     imageUrl2 : String,
     imageUrl3 : String,
     location: String,
     contact: String,
     totalPackage: String,
     createdAt:{
       type : Date,
       default : Date.now() 
     }
   })
  const Products = mongoose.model('Product',propertySchema );
   
   
app.get('/properties', async(req,res)=>{
   try{
     const properties = await Products.find()
     res.json(properties)
   }catch(err){
     console.log(err, 'issues fetching the data  ')
   }
})
   const storage = multer.diskStorage({
       destination : (req,file,cb)=>{ cb(null, 'uploads/')  },
       filename : (req, file,cb)=>{ cb(null, Date.now() + path.extname(file.originalname)) }
    })
     const upload = multer({storage})
     
     
app.post( '/properties', 
    upload.fields(
    [ {name:'file1' ,maxCount:1},
    {name:'file2', maxCount:1},
    {name:'file3' ,maxCount:1},
    ] ),
     async (req,res)=>{
       try{
         
  const{ contact, discription,title, totalPackage, } = req.body;
  const{ file1,file2,file3 } = req.files;
  
  const newproperty = new Products({
    title, 
    contact,
    discription,
    totalPackage,
    imageUrl: file1 ? `/uploads/${file1[0].filename}` : '',
    imageUrl2: file2 ? `/uploads/${file2[0].filename}` : '',
    imageUrl3: file3 ? `/uploads/${file3[0].filename}` : '',

  })
  await newproperty.save();
       }
       catch(err){
         console.log(err)
       }
       
   })
  
  
  
app.listen(port, ()=>{
  console.log(`this is port ${port}, your welcome`)}
   )
