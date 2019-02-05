//REQUIRED STUFF
//-----------------------------
var express=require("express"),
app        = express(),
bodyParser=require("body-parser"),
mongoose   = require("mongoose"),
expressSanitizer=require("express-sanitizer"),
methodOverride =require("method-override");

mongoose.connect('mongodb://localhost:27017/restful_blog_app', { useNewUrlParser: true }); //makes and uses the restful_blog_app database
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method")); //when it sees _method in the url it looks for what it's equal to (ex: put) and treat it like that

//MONGOOSE MODEL STUFF
//------------------------------------
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created:  {type: Date, default: Date.now}
 //gives u current date
});

var Blog=mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test Blog",
//     image: "https://static.comicvine.com/uploads/scale_medium/10/100647/6198653-batman+12.jpg",
//     body: "Here's a pic of batman. He's a pretty awesome character.",
//     created: ""
//     //leave created blank
// });
//you have to have at least one blog to srtart with so u created it, then commented it out


//INDEX ROUTE
//-----------------------------------
app.get("/", function(req, res){ //takes u to the index (home page)
    
    res.redirect("/blogs");
});

app.get("/blogs",function(req, res){
    Blog.find({}, function (err, blogs){ //finds all blog posts, blogs is the name of the data
        if(err){
            console.log("error");
        } else {
            res.render("index.ejs", {blogs1: blogs}); //blogs is blogs1 in the ejs file
        }
    });
});

//NEW ROUTE
//---------------------------------------
app.get("/blogs/new", function(req, res){
   res.render("new.ejs");    
});

//CREATE ROUTE
//-----------------------------------
app.post("/blogs", function(req,res){
//create blog
req.body.blog.body = req.sanitize(req.body.blog.body); //means the body of the request then blog[body] fromt eh form
Blog.create(req.body.blog , function(err, newBlog){ //it takes title, image and body from the
//blog object in new.ejs!!
    if (err){
        res.render ("new.ejs");
    } else {
        res.redirect("/blogs");
    }
    
});

});

//SHOW ROUTE
//-------------------------------------
app.get("/blogs/:id",function(req,res){
  Blog.findById(req.params.id, function (err, foundBlog){
      if(err){
          res.redirect("/blogs");
      } else {
          res.render("show.ejs", {blogAgain: foundBlog}); //means blogs2 on ejs template is foundblogs
      }
  });
});

//EDIT ROUTE
//-------------------------------------
app.get("/blogs/:id/edit", function(req,res){
    Blog.findById(req.params.id, function(err, foundBlog){ //remember req.params.id AND the fucntion are params of the findById func
    if(err){
        res.redirect("/blogs");
    } else {
        res.render("edit.ejs",{blogOne: foundBlog});
    }
        
    });
});

//UPDATE ROUTE
//-----------------
app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body); //means the body of the request then blog[body] fromt eh form
    Blog.findByIdAndUpdate(req.params.id,req.body.blog, function (err, updatedBlog){
        if (err){
            res.redirect ("/blogs");
        } else {
            res.redirect("/blogs/"+req.params.id);
        }
    });
    //this function takes 3 arguments (id,new data, callback)
    //the reason the new data is req.bodyblog is because in the form in the edit file, blog has all that blog[...]
});

//DESTROY ROUTE
//-----------------------
app.delete("/blogs/:id", function (req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if (err){
            res.redirect("/blogs");
        } else {
            res.redirect("/blogs");
        }
    });
});

//ABOUT/ME ROUTE
app.get("/about",function(req, res){
            res.render("about.ejs"); //blogs is blogs1 in the ejs file
        }
    );



app.listen(process.env.PORT, process.env.IP,  
function(){console.log("server has started\n");} 
);

