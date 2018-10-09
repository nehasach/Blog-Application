var express= require("express"),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
methodOverride=require("method-override"),
expressSanitizer=require("express-sanitizer"),
app = express();

mongoose.connect("mongodb://localhost/blogApp");

app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());
//set up mongoose

var blogSchema=mongoose.Schema({
   title:String,
   image:String,
   body:String,
   created:{type:Date, default:Date.now}
});

var Blog=mongoose.model("Blog",blogSchema);

//ROUTES
// Blog.create({
//    title: "SouthEastern Dog",
//    image:"https://www.guidedogs.org/wp-content/uploads/2018/01/Mobile.jpg",
//    body:"You love puppies. You want to make a difference and you’re willing to commit to a purpose greater than yourself. You’re not quite sure if you know enough, but we’re sure that we can teach you!"
// });
app.get("/",function(req, res) {
   res.redirect("/blogs"); 
});
//INDEX Route
app.get("/blogs",function(req,res){
   Blog.find({},function(err,blogs){
      if(err)
         console.log(err);
      else
        res.render("index",{blogs:blogs}); 
   });
   
});

//NEW ROUTE & CREATE ROUTE
app.get("/blogs/new",function(req, res) {
   res.render("new") 
});

//CREATE DOG
app.post("/blogs",function(req,res){
   req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.create(req.body.blog,function(err,newblog){
   if(err)
   res.render("new");
   else
   res.redirect("/blogs")
});
   
});

//SHOW ROUTE

app.get("/blogs/:id", function(req, res) {
   Blog.findById(req.params.id, function(err,blog){
      if(err)
      res.redirect("/blogs");
      else
      res.render("show",{blog:blog});
   });
    //res.send("show");
});

//EDIT and UPDATE

app.get("/blogs/:id/edit", function(req, res) {
   Blog.findById(req.params.id, function(err,blog){
      if(err)
      res.redirect("/blogs");
      else
      res.render("edit",{blog:blog});
   });
 
});


app.put("/blogs/:id",function(req,res){
   //res.send("update");
     // req.body.blog.body = req.sanitize(req.body.blog.body);
   Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updated){
     if(err)
     res.redirect("/blogs");
     else
     res.redirect("/blogs/"+req.params.id)
   });
});


//DESTROY

app.delete("/blogs/:id", function(req,res){
   Blog.findByIdAndRemove(req.params.id,function(err){
      if(err)
      res.redirect("/blogs");
      else
      res.redirect("/blogs");
   });
   ;
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelp Camp Server has !");
});