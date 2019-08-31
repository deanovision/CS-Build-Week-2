const utf8 = require("utf8");
const axios = require("axios");
const crypto = require("crypto");

let cooldown = new Promise((resolve, reject)=>{
    console.log("COOLDOWN")
    setTimeout(()=>{
        resolve("resolved")
    }, 10000)
    
  })

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
        return res.data
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
  if (proof % 1000000 === 0 && proof !== 0)console.log(proof);
    let str = `${lastProof.proof}${proof}`;
    let guess = utf8.encode(str);

    let guess_hash = crypto
    .createHash("sha256")
    .update(guess)
    .digest("hex");
  
//   console.log(proof);
//   console.log(">>>>>>>",guess_hash)


  return (
    guess_hash.slice(0, lastProof.difficulty) ===
    "0".repeat(lastProof.difficulty)
    
  )
}

function mine_proof(found_proof) {
  return axios
    .post(
      "https://lambda-treasure-hunt.herokuapp.com/api/bc/mine/",
      { proof: found_proof },
      {
        headers: {
          "content-type": "application/json",
          Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
        }
      }
    )
    .then(res => {
        console.log(res)
        return res
    })
    .catch(err => {
      console.log(err.message);
    });
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

let coins_mined = 0;
async function miner() {
    
  while (true) {

    let lp = await lastProof();
    console.log("mining proof");

    let foundProof = await pow(lp);
    console.log(foundProof,"found proof");

    let mine_response = await mine_proof(foundProof);
    console.log("response from mining ", mine_response);
    await timeout(10000);
  }
}