const mongoose=require("mongoose")

mongoose.connect("mongodb://localhost:27017/sectiopedia", {
    // useNewUrlParser:true,
    // useUnifiedTopology:true,
    // useCreateIndex:true
}).then(()=>{
    console.log("Connection successfull!!")
}).catch((err)=>{
    console.log(err)
})