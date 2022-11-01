const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('/', (req, res) =>
  res.sendFile(path.resolve(__dirname, 'build', 'index.html')),
);

const port = process.env.PORT || 8005;

app.listen(port, function() {
  console.log('Frontend is running on port: ', port);
});
