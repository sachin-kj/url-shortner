const express=require('express');
const urlRoute=require("./routes/url")
const {   connectMongodb }=require('./connect');
const url = require('./model/url');

const app=express();
const port=8001;

connectMongodb('mongodb://localhost:27017/short-url')
.then(()=>console.log("connected"))

app.use(express.json())
app.use('/url',urlRoute)

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