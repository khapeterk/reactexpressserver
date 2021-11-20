const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();

mongoose
  .connect(process.env.DB_URL, {useNewURLParser: true})
  .then(() => {
    const testSchema = mongoose.Schema({
      key: String
    })

    const testModel = mongoose.model('testcollection', testSchema);

    app.use(express.static(path.join(__dirname, 'build')));

    app.get('/api/test', async (req, res) => {
        const test = await testModel.find({key: 'value'});
        res.send(test);
    })

    app.get('/api/count', (req, res) => {
      const contents = fs.readFileSync('count.txt');
      const count = (parseInt(contents)+1).toString();
      fs.writeFileSync('count.txt', count);
      res.send('Count file has been visited ' + count + ' times');
    })

    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'build', 'index.html'));
    });
    
    const port = process.env.PORT || 5000;
    app.listen(port);
  })