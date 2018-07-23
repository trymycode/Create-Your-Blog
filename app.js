var express         =       require("express"),
    expressSanitizer=       require("express-sanitizer"),
    methodOverride  =       require("method-override"),
     app            =       express(),
     bodyParser     =       require("body-parser"),
     mongoose       =       require("mongoose");
     

//  importent setup of this app/app config
    //mongoose configuration
        mongoose.connect("mongodb://localhost/restful_blog_app");
    //other importent config
        app.set("view engine", "ejs");
        app.use(express.static("public"));
        app.use(bodyParser.urlencoded({extended: true}));
        app.use(expressSanitizer());
        app.use(express.static(__dirname + "/public"));
        app.use(methodOverride("_method"));


// mongoose schema creation
var blogSchema = new mongoose.Schema({
    Title: String,
    Image: String,
    body:  String,
    Created: { type: Date, default: Date.now }
    
});



// mongoose model creation
var Blog = mongoose.model("Blog", blogSchema);


// RESTFUL ROUTES
// INDEX ROUTE
app.get("/blogs",function(req, res){
    Blog.find({},function(err, blogs){
        if(err){
            console.log(err);
        }
        else{
            res.render("index", {blogs: blogs});
        }
        
    })
})

app.get("/",function(req, res){
    res.redirect("/blogs");
})
// NEW ROUTE
app.get("/blogs/new",function(req, res){
    res.render("new");
})

// CREATE ROUTE

app.post("/blogs", function(req, res){
    // create blog
   
    req.body.blog.body = req.sanitize( req.body.blog.body);
    
    Blog.create(req.body.blog , function(err, newBlog){
        if(err){
            res.render("new");
        }
         // then redirect to index page /blogs
        else{
            res.redirect("/blogs");
        }
    })
   
})
// SHOW ROUTE
app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("show",{blog: foundBlog});
           
        }
    })
})
//EDIT ROUTE
app.get("/blogs/:id/edit",function(req, res){
    
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs");
        }
        else{
            res.render("edit",{blog: foundBlog});
            }
    });
   
    
})
// UPDATE ROUTE
app.put("/blogs/:id", function(req, res){
     req.body.blog.body = req.sanitize( req.body.blog.body);
    // Blog.findByIdAndUpdate(id, newData, callBack)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs");
        }else{
            res.redirect("/blogs/"+req.params.id);
        }
    })
})
// DESTROY ROUTE
app.delete("/blogs/:id", function(req, res){
    // destroy the blog
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs");
        }
        else{
             res.redirect("/blogs");
        }
    })
    // Redirect somewhere
})



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("+++++Server has started+++++");
});