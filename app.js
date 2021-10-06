require('dotenv').config();
const bodyParser=require("body-parser");
const express=require("express");
const ejs=require("ejs");
const mongoose=require("mongoose");
const encrypt=require("mongoose-encryption");

const app=express();


console.log(process.env.API_KEY);
//app.set('viewengine','ejs')
app.set('view engine', 'ejs');
//app.use(bodyParser.urlencoded({extended:true}));

//var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser:true});
//mongoose.connect("mongodb://localhost:27017/blogsDb",{useNewUrlParser:true});


const userSchema= new mongoose.Schema({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET,encryptedFields:["password"]});

const User=new mongoose.model("User",userSchema);


app.get("/",function(req,res){
  res.render('home');
});

app.get("/login",function(req,res){
  res.render("login");
});

app.get("/register",function(req,res){
  res.render("register");
})

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}


app.listen(port,function(){
  console.log("server started at port 3000");
  //res.render("test");

});
app.post("/register",function(req,res){
  const newUser=new User({
    email:req.body.username,
    password:req.body.password
  });
  newUser.save(function(err){
    if(err){
      console.log(err);
    }
      else{
        res.render("secrets");
        console.log("user registered to database");
        console.log("username:"+newUser.email);
        console.log("password:"+newUser.password);
          }
              });
  });

app.post("/login",function(req,res){
  const usrname=req.body.username;
  const passwrd=req.body.password;

  User.findOne({email:usrname},function(err,foundUsr){
    if(err){
      console.log(err);
    }
      else{
        if(foundUsr){
        if(foundUsr.password===passwrd)
        {
        res.render("secrets");
        }
         }
       }
    });

});
