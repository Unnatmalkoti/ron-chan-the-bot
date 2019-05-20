const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://unnat:nonstop98@ron-chan-the-bot-izi3w.mongodb.net/test?retryWrites=true";
const dbName = "ronchan";
var mongodb;



//Use connect method to connect to the Server
MongoClient.connect(uri, {  
  poolSize: 10,
  useNewUrlParser: true
  // other options can go here
},function(err, db) {
    assert.equal(null, err);
    mongodb=db;
    }
)
module.exports.database = {
dbName,addChapter,addNotification,deleteNotification,assert,getAllChapters,getAllNotifications,getConfig
}


async function getAllChapters(){
  try{
      var collection = mongodb.db(dbName).collection("notified_chapters");
      return await collection.find().toArray();
  }
  catch(err)
  {
    console.log(err)
  }

}

async function getAllNotifications(){
  try
  {
      var collection = mongodb.db(dbName).collection("notifications");
      return await collection.find().toArray();
  }

  catch(err)
  {
    console.log(err)
  }
  

  
}

async function getConfig(){
  try
  {
      var collection = mongodb.db(dbName).collection("configurations");
      let configArray = await collection.find().toArray();
      return configArray[0] ;
  }
  catch(err)
  {
    console.log(err)
  }
  
}

function addChapter(chapter)
{
  try
  {
      console.log("Connected successfully to server");

      const db = mongodb.db(dbName);
      const collection = db.collection("notified_chapters");
      insert(collection, [chapter],
      function(){
        client.close();
      });
      
  }
  catch(err)
  {
    console.log(err);
  }
  
}
function addNotification(notification)
{    
    console.log("Connected successfully to server");

    const db = mongodb.db(dbName);
    const collection = db.collection("notifications");

    insert(collection,[notification],
      function(){
      });
}

function deleteNotification(query_str)
{
  
    console.log("Connected successfully to server");

    const db = mongodb.db(dbName);
    const collection = db.collection("notifications");

    remove(collection,query_str,
      function(){
      
      })

}

function insert(collection,data_array,callback)
{
  collection.insertMany(data_array, 
    function(err,result){
      if(err)
        console.log(err);
      
      else
         console.log(result);
      
      callback(result);
  });

}

function remove(collection,query_str,callback)
{
  collection.deleteOne(query_str,
    function(err,result){
      if(err)
        console.log(err);
      else
        console.log("Deleted");
      callback(result);
    });
}



