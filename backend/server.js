const express = require("express");
const server = express();
const utf8 = require("utf8");
const axios = require("axios");
const crypto = require("crypto");

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

server.get("/mine", (req, res) => {
  mine()
    .then(coin => {
      res.status(200).json(coin);
    })
    .catch(err => {
      res.status(500).json(err.message);
    });
});

function lastProof() {
  return axios({
    method: "GET",
    headers: {
      "content-type": "application/json",
      Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
    },
    url: "https://lambda-treasure-hunt.herokuapp.com/api/bc/last_proof/"
  })
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(err => {
      console.log(err.message);
    });
}

function pow(lastProof) {
  let proof = 0;
  while (validProof(lastProof, proof) === false) {
    proof += 1;
  }
  return proof;
}

function validProof(lastProof, proof) {
  if (proof % 1000000 === 0 && proof !== 0) console.log(proof);
  let str = `${lastProof.proof}${proof}`;
  let guess = utf8.encode(str);

  let guessHash = crypto
    .createHash("sha256")
    .update(guess)
    .digest("hex");

  return guessHash.slice(0, lastProof.difficulty) === "000000";
}

function mineProof(foundProof) {
  return axios
    .post(
      "https://lambda-treasure-hunt.herokuapp.com/api/bc/mine/",
      { proof: foundProof },
      {
        headers: {
          "content-type": "application/json",
          Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
        }
      }
    )
    .then(res => {
      console.log(res.data);
      return res.data;
    })
    .catch(err => {
      console.log(err.message);
    });
}
function cooldown() {
  return new Promise(resolve => setTimeout(resolve, 1000 * 10));
}

async function mine() {
  return new Promise(async (resolve, reject) => {
    let finished = false;
    while (finished !== true) {
      let lp = await lastProof();
      console.log("mining proof");

      let foundProof = await pow(lp);
      console.log(foundProof, "found proof");

      let miningResults = await mineProof(foundProof);
      console.log("response from mining ", miningResults);
      if (miningResults !== undefined) {
        finished = true;
        resolve(miningResults);
      }
      await cooldown();
    }
  });
}

module.exports = server;
