const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello APi');
});

app.listen(3000, () => {
  console.log(`running at 3000`);
});
