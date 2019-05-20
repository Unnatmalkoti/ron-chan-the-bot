const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const uri = "mongodb+srv://unnat:nonstop98@ron-chan-the-bot-izi3w.mongodb.net/test?retryWrites=true";
const client = new MongoClient(uri, { useNewUrlParser: true });
const dbName = "ronchan";

module.exports.database = {
  client,dbName,addChapter,addNotification,deleteNotification,assert,getAllChapters,getAllNotifications,getConfig
}
//Use connect method to connect to the Server
getConfig();

function getAllChapters(){
  try{
    return client.connect().then(function(client){
      var collection = client.db(dbName).collection("notified_chapters");
      return collection.find().toArray();
    }).then((items)=>{
      
      client.close();
        console.log(items);
        return items;
    });

  }
  catch(err)
  {
    console.log(err)
  }

}

function getAllNotifications(){
  try
  {
    return client.connect().then(function(client){
      var collection = client.db(dbName).collection("notifications");
      return collection.find().toArray();
    }).then((items)=>{
        //console.log(items);
        client.close();
        return items;
      });
  }

  catch(err)
  {
    console.log(err)
  }
  

  
}

function getConfig(){
  try
  {
    return client.connect().then(function(client){
     
      var collection = client.db(dbName).collection("configurations");
      return collection.find().toArray();
    }).then((items)=>{
        console.log(items);
        client.close();
        return items[0];
    });
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
    client.connect(function(err) {
      assert.equal(null, err);
      console.log("Connected successfully to server");
  
      const db = client.db(dbName);
      const collection = db.collection("notified_chapters");
      insert(collection, [chapter],
      function(){
        client.close();
      });
      
  });
  }
  catch(err)
  {
    console.log(err);
  }
  


}

function addNotification(notification)
{
  client.connect(function(err)
  {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection("notifications");

    insert(collection,[notification],
      function(){
        client.close();
      });

  });
}

function deleteNotification(query_str)
{
  client.connect(function(err)
  {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
    const collection = db.collection("notifications");

    remove(collection,query_str,
      function(){
        client.close();
      })

  });
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



