const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = express();

mongoose
  .connect('mongodb+srv://2wjNtvZfN4RrXSFv51:g4N^nw1FJXzx^YDtJT@cluster0.cgal7.mongodb.net/testdb?retryWrites=true&w=majority', {useNewURLParser: true})
  .then(() => {
    const testSchema = mongoose.Schema({
      key: String
    })

    const testModel = mongoose.model('testcollection', testSchema);

    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });

    app.get('/api/test', async (req, res) => {
      const test = await testModel.find();
      res.send(test);
    })

    app.get('/api/count', (req, res) => {
      const contents = fs.readFileSync('count.txt');
      const count = (parseInt(contents)+1).toString();
      fs.writeFileSync('count.txt', count);
      res.send('Count file has been visited ' + count + ' times');
    })
    
    const port = process.env.PORT || 3000;
    app.listen(port);
  })