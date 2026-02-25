const express=require('express');
const path=require('path')
const urlRoute=require("./routes/url")
const {   connectMongodb }=require('./connect');
const url = require('./model/url');
const staticRoute=require('./routes/StaticRouter');

const app=express();
const port=8001;

connectMongodb('mongodb://localhost:27017/short-url')
.then(()=>console.log("connected"))

app.set("view engine","ejs");
app.set('views',path.resolve('./views'))



app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use('/url',urlRoute)
app.use('/',staticRoute)

app.get("/test",async(req,res)=>{
    const allurl=await url.find({})
    return res.render('home',{
        urls:allurl
    })
})

app.get('/:shortid',async (req,res)=>{
    const shortid=req.params.shortid

    const entry= await url.findOneAndUpdate(
        {shortid: shortid  },
        {
            $push:{
                visithistory:{
                    timestamp: Date.now()
                }
            }
        },
        { returnDocument: 'after' }
    )
      if(!entry){
        return res.send("Short URL not found")
    }

    res.redirect(entry.redirecturl)
})

app.listen(port,()=>console.log(`app is running on port no ${port}`))