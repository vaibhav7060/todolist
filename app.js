//  requiring packages
const express = require('express');
const bodyParser = require('body-parser');
const date = require(__dirname+'/date.js');
const mongoose = require('mongoose');

//  defining express
const app = express();

//  changing view engine to e-js for embedding js in HTML files
app.set('view engine', 'ejs');
// sets data requested to all datatypes from only string
app.use(bodyParser.urlencoded({extended : true}));
// looks for json files and converts them into js objects
app.use(bodyParser.json());
// creates a local environment to store all required files
app.use(express.static("public"));


//  connecting mongoose to local database and aldo creating todolistDB if not there
mongoose.connect("mongodb://localhost:27017/todolistDB");

//  creating schema
const entrySchema = new mongoose.Schema({
  entry: String
});

// creting mongoose model
const Item = mongoose.model("item",entrySchema);


const item1 = new Item({
  entry: "eat"
});
const item2 = new Item({
  entry: "sleep"
});
const item3 = new Item({
  entry: "repeat"
});
const todoItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items: []
};

const List = mongoose.model("list",listSchema);



//  creaing two arrays to store data
let workItems = [];
let items = ["eat","sleep","repeat"];






//  to display list.ejs on "/" route providing listTitle and newListItems as variables to render on list.ejs
app.get("/", function(req, res) {
//    for getting current day and date
  let day = date();

  Item.find({},function(err,foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(todoItems,function(err){
        if (err) {
          console.log(err)
        }
      });
      res.redirect("/");
     } else {
          res.render("list", {
            listTitle: "Today",
            newListItems: foundItems });
       }
    });
  });


  app.get("/:name",function(req,res){
    const customListName = req.params.name ;

    List.findOne({name:customListName}, function (err,foundList){
      if (!err){
        if (!foundList){
          const list = new List ({
            name: customListName,
            items: todoItems
          });
          list.save();
          res.redirect("/"+customListName);
        } else {
          res.render("list",{listTitle: foundList.name , newListItems: foundList.items})
        }
      }
    })
  })



//  it wiil be activated when page sends a post request to "/" url
//  callback function will take entered todo item and stores it into variable
// then checks for item added and pushes it in its respective array
app.post("/",function(req,res){

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const newEntry = new Item({
    entry : itemName
  });
  if (listName === "Today") {
    newEntry.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName},function(err,foundList){
      foundList.items.push(newEntry);
      foundList.save();
      res.redirect("/"+ listName)
    })
  }

});


app.post("/delete",function(req,res){
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName();

  if (listnName === "Today"){
    Item.findByIdAndRemove(checkedItemId,function(err){
      if(!err){
        console.log("succesfully deleted checked item !")
      }
    })
    res.redirect("/");
  } else {
    
  }

});




//  to listen on port 3000 for any calls
app.listen(3000, function() {
  console.log("Servaer started started on port 3000...")
});
