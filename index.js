const express = require('express')
const cors = require('cors');
const app = express()

// using environment variables to enable containers to set the port they want to have the app work on
const port = process.env.PORT || 8491

// as this will be a json API we'll use the json middleware provided by express
app.use(express.json(), cors())

var theData = [
    {id:1,task:"feed cat",done:false},
    {id:2,task:"make bed great again",done:false},
    {id:3,task:"run marathon",done:true}
]

var aCounter = 3

app.get('/api', (req, res) => {
  res.send(theData)
})

//Here's how we add new tasks to the above array
app.post('/api', (req,res) => {    
// we will autoincrement the ID, for reasons
    var id = parseInt(aCounter + 1);
    const {task} = req.body;
// Just some sanity checks, validate the inputs
    if(!task) {
        res.status(400).send({message:'We need a task , try send a "task" field in your json object add some text in the task field ?'})
    }

// store the data in a new object that somewhat enforces data types
    coolNewTask = {id:id,task:`${task}`,done:false}

    res.status(201).json(coolNewTask);

// we can now post things to this endpoint, I like curl
// curl -d '{"task":"teraform mars"}' -H "Content-Type: application/json" -X POST http://localhost:8491/
// curl -d '{"task":""}' -H "Content-Type: application/json" -X POST http://localhost:8491/
    theData = [coolNewTask,...theData]
    aCounter++

})

// change a task
app.put('/api/:id', (req, res) => {
    var id = req.params.id
    const {task} = req.body
    const {done} = req.body
    // check to where the object is in the array
    objIndex = theData.findIndex((obj => obj.id == id));

    // Fail quickly if there is no such task
    if(!theData[objIndex]) {
        res.status(404).send({message:'That task is not here'});
    }

    if(!task) {
        res.status(405).send({message:'We must have a task'});
    }
    //if(!done) {
    //    res.status(405).send({message:'We must have a true or false done'});
    //}
    if (!('id' in req.body)) {
        req.body.id = parseInt(id);
    }

    // if the above conditions are met, modify the task that was requested

    theData[objIndex] = req.body;
    res.status(204).send();
    
  });

  app.delete('/api/', (req, res) => {

    const {id} = req.body
    if(!id) {
      res.status(405).send({message:'Who do you want removed'});
    }
    if(theData.filter(todo => todo.id == id).length !== 0){
      theData = theData.filter(todo => todo.id !== id);
      res.status(200).send({message:'Task removed'});
    }else{
      res.status(404).send({message:'That task is not here'});
    }
  });

app.listen(port, () => {
  console.log(`Alive and well on port ${port}`)
})
