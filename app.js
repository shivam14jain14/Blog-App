var bodyParser   =require("body-parser"),
methodOverride   =require("method-override"),
mongoose         =require("mongoose"),
expressSanitizer =require("express-sanitizer"),
express          =require("express"),
app              =express();


//App CONFIGURATIONS
mongoose.connect("mongodb://localhost:27017/restful_blog_app", {useNewUrlParser:true});
mongoose.set("useFindAndModify", false);
mongoose.set('useUnifiedTopology', true);
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressSanitizer());
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(methodOverride("_method"));



//title
//image
//body
//created


//mongooe/model/configuration
var blogSchema=new mongoose.Schema({
	title:String,
	image:String,
	body:String,
	created:{type:Date,default:Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);

/// to create a single one
/*
Blog.create({
	title:"My Space",
	image:"https://images.unsplash.com/photo-1587522705669-61de54c723bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
	body:"This palce is my peacemaker.I relax here and do my thinking."
	
});*/
	
///N RESTFUL ROUTES
app.get("/",function(req,res)
	   {
	res.redirect("/blogs");
});
//INDEX ROUTE
app.get("/blogs",function(req,res)
	   {
	Blog.find({},function(err,blogs)
			 {
		res.render("index",{blogs:blogs});
	});
	    
});

///New route
app.get("/blogs/new",function(req,res)
	   {
	res.render("new");
});

///Create Route
app.post("/blogs",function(req,res)
	   {
	req.body.blog.body=req.sanitize(req.body.blog.body);
	
	Blog.create(req.body.blog,function(err,newBlog)
	{
		if(err)
			res.render("new");
		else
		res.redirect("/blogs");
	});
	
});

//Show route
app.get("/blogs/:id",function(req,res)
	   {
	Blog.findById(req.params.id,function(err,foundBlog)
				 {
		if(err)
			console.log("error");
		else 
			res.render("show",{blog:foundBlog});
	});
});
///Edit Route
app.get("/blogs/:id/edit",function(req,res)
	   {
	Blog.findById(req.params.id,function(err,foundBlog)
				 {
		if(err)
			console.log("error")
		else 
			res.render("edit",{blog:foundBlog});
	})
	
});
///UPDATE ROUTE

app.put("/blogs/:id",function(req,res)
	   {
	req.body.blog.body=req.sanitize(req.body.blog.body);
	Blog.findByIdAndUpdate(req.params.id,req.body.blog,function(err,updatedBlog)
						  {
		if(err)
			res.redirect("/blogs")
		else
			res.redirect("/blogs/"+req.params.id);
	
	});
	
});


///DELETE REQUEST
app.delete("/blogs/:id",function(req,res)
		  {
Blog.findByIdAndRemove(req.params.id,function(err)
					  {
	res.redirect("/blogs")
});
	
});













app.listen(process.env.PORT||3000,process.env.IP,function()
		  {
	console.log("rest_blog_app server has started ");
});