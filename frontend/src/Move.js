import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios"

let currentRoom;



function Move({setRoom, room, map, setMap}) {
  const timeout = room.cooldown * 1000 || 10 * 1000
  const [timer, setTimer] = useState(0)

//   useEffect(()=>{
//     setTimer(timeout)
//     while(timer > 0){
//       setTimeout(()=>{
//         setTimer(prevTimer => prevTimer -=1)
//       },1000)
//     }
//   },[timer])


  function init(){
    axios({
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
        },
        url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/init/"
      })
        .then(res => {
          console.log(res.data)
          setRoom(res.data)
        })
        .catch(err => {
          console.log(err.message);
        });
  }


  function move(direction){
    return axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
      },
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/move/",
      data: {"direction": direction}
    })
      .then(res => {
        console.log(res.data)
        currentRoom = res.data
        setRoom(res.data)
        return res.data
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  function sell(direction){
    return axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
      },
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/sell/",
      data: {"name": "treasure", "confirm": "yes"}
    })
      .then(res => {
        console.log(res.data)

      })
      .catch(err => {
        console.log(err.message);
      });
  }

  function take(direction){
    return axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
      },
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/take/",
      data: {"name": "treasure"}
    })
      .then(res => {
        console.log(res.data)

      })
      .catch(err => {
        console.log(err.message);
      });
  }

  function status(direction){
    return axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
      },
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/status/",
      data: {"name": "treasure"}
    })
      .then(res => {
        console.log(res.data)

      })
      .catch(err => {
        console.log(err.message);
      });
  }
  function changeName(direction){
    return axios({
      method: "POST",
      headers: {
        "content-type": "application/json",
        Authorization: "Token fe4130389e7e605fc60f4bae7947974b04a983d4"
      },
      url: "https://lambda-treasure-hunt.herokuapp.com/api/adv/change_name/",
      data: {"name": "[deanovision]", "confirm": "aye"}
    })
      .then(res => {
        console.log(res.data)

      })
      .catch(err => {
        console.log(err.message);
      });
  }


  function countdown(){
    let counter = timeout
    console.log("countdown",counter)
    while(counter > 0){
      setTimeout(()=>{
        counter -=1
        console.log("countdown",counter)
      },1000)
    }
    return true
  }

  let cooldown = new Promise((resolve, reject)=>{
    resolve(countdown)
  })

  console.log("MAP>>", map)
  console.log("Room>>", room)
  return (
    <div className="App">
      
        <h1>{room.title ? room.title : null}</h1>
      <h3>{room ? room.room_id: null}</h3>
      <h3>{room.description ? room.description: null}</h3>
      <h3>{room.cooldown ? room.cooldown : null}</h3>
      <h3>{timer ? timer: null}</h3>
      <div>{room.messages ? room.messages.map(message => {
        return <p>{message}</p>
      }) : null}</div>
    <div>{room.items ? room.items.map(items => {
        return <p>{items}</p>
      }) : null}</div>
    <div>{room.exits ? room.exits.map(exits => {
        return <p>{exits}</p>
      }) : null}</div>
      <button onClick={()=> init()}>START</button>
      <button onClick={()=> take()}>TAKE ITEM</button>
      <button onClick={()=> sell()}>SELL ITEM</button>
      <button onClick={()=> status()}>STATUS</button>
      <button onClick={()=> changeName()}>NAME CHANGE</button>
      <button onClick={()=> move("n")}>N</button>
      <button onClick={()=> move("s")}>S</button>
      <button onClick={()=> move("e")}>E</button>
      <button onClick={()=> move("w")}>W</button>

    </div>
  );
}

export default Move;
