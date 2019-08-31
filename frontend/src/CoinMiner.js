import React from "react"
import axios from "axios"


function startMining() {
  axios({
    method: "GET",
    // headers: {
    //   "content-type": "application/json",
    //   Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
    // },
    url: "http://localhost:5000/mine"
  })
    .then(res => {
      console.log(res.data);
        
    })
    .catch(err => {
      console.log(err.message);
    });
}


function CoinMiner(){
    return(
        <div>
            <button onClick={()=>startMining()}>MINE</button>
        </div>
    )
}
export default CoinMiner