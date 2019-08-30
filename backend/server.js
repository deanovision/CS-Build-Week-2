const express = require("express");
const axios = require("axios");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  axios({
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
    },
    url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/"
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.send(err.message);
    });
});

server.post("/move", (req, res) => {
  console.log(req.body);
  axios({
    method: "POST",
    headers: {
      "content-type": "application/json",
      Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
    },
    url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
    data: req.body
  })
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.send(err.message);
    });
});

module.exports = server;
