var express = require("express"),
app         = express(),
mongoose    = require("mongoose"),
methodOverride = require("method-override"),
bodyParser  = require("body-parser");

//connect to a db
//mongoose.connect("mongodb://localhost/restful_inventory");
mongoose.connect("mongodb://ken:mfc@ds113678.mlab.com:13678/mfc_inventory");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));

//create the mongoose schema
var inventorySchema = new mongoose.Schema({
    item:String,
    image:String,
    size:String,
    amtRemaining:Number,
    parLevel:Number
    
});

//create the model
var Inventory = mongoose.model("Inventory",inventorySchema);

//create simple data for the db
// Inventory.create({
//     item:"surgical shoe",
//     image:"http://www.vmorthotics.co.uk/images/DARCO_MedicalSurgical-STimg.png",
//     size:"Large",
//     amtRemaining:3,
//     parLevel:5
    
// });

//---------------------------------ROUTES---------------------------------------//

//INDEX
app.get("/",function(req,res){
   res.redirect("/inventory"); 
});

app.get("/inventory",function(req,res){
    
        Inventory.find({},function(err,inventory){
           if(err){
               console.log(err);
           }else{
               res.render("index",{inventory:inventory});
           }
       }) 
   
});

//NEW ROUTE
app.get("/inventory/new",function(req,res){
    res.render("new");
});

//CREATE ROUTE
app.post("/inventory",function(req,res){
    var item = req.body.inventory;
    
   Inventory.create(item,function(err,createdInventory){
      if(err){
          res.render("new");
      } else{
          res.redirect("/inventory");
      }
   });
});

//SHOW ROUTE
app.get("/inventory/:item",function(req,res){
    Inventory.find({"item":{ "$regex": req.params.item, "$options": "i" }},function(err,foundIventory){
      if(err){
          console.log("not found")
          res.redirect("/inventory");
      } else{
          console.log(foundIventory)
          res.render("show",{inventory:foundIventory});
      }
    });
});

//EDIT ROUTE
app.get("/inventory/:id/edit",function(req,res){
   Inventory.findById(req.params.id,function(err,foundInventory){
       if(err){
           res.redirect("/inventory");
       }else{
           res.render("edit",{inventory:foundInventory});
       }
   }); 
});

//UPDATE ROUTE
app.put("/inventory/:id",function(req,res){
   Inventory.findByIdAndUpdate(req.params.id,req.body.inventory,function(err,updatedInventory){
       if(err){
           res.redirect("/inventory");
       }else{
           res.redirect("/inventory"/*+req.params.id*/);
       }
   }); 
});

//DELETE ROUTE
app.delete("/inventory/:id",function(req,res){
    Inventory.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/inventory");
        }else{
            res.redirect("/inventory");
        }
    })
})


app.listen(process.env.PORT,process.env.IP,function(){
    console.log("SERVER IS RUNNING");
})