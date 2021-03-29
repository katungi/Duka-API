const express = require('express');
const app = express();

require('dotenv/config');

// middleware

app.use(express.json());

const api = process.env.API_URL;

app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: 'hair dresser',
    image: 'some_url',
  };
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  // res.send(product);
});

app.listen(3000, () => {
  console.log(api);
  console.log(`running at 3000`);
});
