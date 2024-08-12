require("dotenv").config()
const path=require("path")
const express=require("express")
const app=express()
require("./db/connection")
const hbs=require("hbs")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const cookieParser=require("cookie-parser")
const auth=require("./middleware/auth")

const register=require("./models/registers")

const port=process.env.PORT ||8000

// console.log(path.join(__dirname,"../public"))
const staticPath=path.join(__dirname,"../public")
const template_path=path.join(__dirname,"../templates/views")
const partial_path=path.join(__dirname,"../templates/partials")
app.use(express.static(staticPath))

app.set("view engine","hbs")

// setting the adress for templates
app.set("views",template_path)

// Registering the partials
hbs.registerPartials(partial_path)

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({extended:false}))

// console.log(process.env.SECRET_KEY)

app.get("/",(req,res)=>{
    res.render("index") 
})

app.get("/profile",auth,(req,res)=>{
    res.render("profile") 
})

app.get("/logout",auth,async(req,res)=>{
    try {
        req.user.tokens=req.user.tokens.filter((currElement)=>{
            return currElement.token!=req.token
        })
        res.clearCookie("jwt")
        console.log("logged out successfully")
        await req.user.save()
        res.render("login")
    } catch (error) {
        res.status(404).send(error)
    }
})

app.get("/signup",(req,res)=>{
    res.render("signup")
})

// creating a new user in ou database
app.post("/signup",async(req,res)=>{
  try {
    const password=req.body.password
    const confirm_password=req.body.confirm_password

    if(password===confirm_password)
    {
        const registerStudent= await new register({
            firstname:req.body.firstname,
            lastname:req.body.lastname,
            email:req.body.email,
            section:req.body.section,
            phone:req.body.phone,
            // dob:req.body.dob,
            password:req.body.password,
            confirm_password:req.body.confirm_password
        })

        console.log("The details are: "+registerStudent)

        const token=await registerStudent.generateAuthToken()

        // console.log("Token is: " +token)

        // Setting up cookies
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+600000),
            httpOnly:true 
        })

        // console.log("Cookie is: "+cookie)

       const registered= await registerStudent.save()
    //    console.log("Token is: " +token)
       res.status(201).render("index")
    }
    else{
        res.send("password are not matching")
    }
  } catch (error) {
    res.status(400).send(error)
  }
})

app.get("/login",(req,res)=>{
    res.render("login")
})

app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email
        const password=req.body.password

        const userEmail=await register.findOne({email:email})
       
        // we are checking at the time of login that user entered password and hashpassword are the same.
        const isMatch=await bcrypt.compare(password,userEmail.password)

        const token=await userEmail.generateAuthToken()
        console.log("Login Token is: " +token)

        res.cookie("jwt",token,{
            // expires:new Date(Date.now()+600000),
            httpOnly:true 
        })


        if(isMatch){
            res.status(201).render("profile")
        }
        else{
            res.status(404).render("loginerror")
        }
    }
    catch(error){
        res.status(404).send("Invalid Mail")
    }
})

app.get("/materials",auth,(req,res)=>{
    res.render("materials")
})

app.get("/faculty",auth,(req,res)=>{
    res.render("faculty")
})

app.get("/students",auth,(req,res)=>{
    res.render("students")
})



app.listen(8000,()=>{
    console.log(`Port running at ${port}`)
})