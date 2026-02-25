const {  nanoid }=require("nanoid")
const url =require('../model/url')
async function handleGenerateNewShortUrl(req,res) {
    const body=req.body;
    if(!body.url){
        return res.status(400).json({error: 'no url provided'})
    }
      const  shortID=nanoid(8);

await url.create({
 shortid:shortID,
 redirecturl:body.url,
 visithistory:[]
})

    const allUrls = await url.find({});
      return res.render('home', {
        id: shortID,
        urls: allUrls   // 🔥 SEND THIS
    });
}
async function handleGetAnalytics(req,res){
    const shortid=req.params.shortid
    const result=await url.findOne({shortid})
      if (!result) {
        return res.status(404).json({ error: "Short URL not found" });
    }
    
    return res.json({
    totalclicks:result.visithistory.length,
    analytics:result.visithistory
    })
} 
module.exports={handleGenerateNewShortUrl,handleGetAnalytics}