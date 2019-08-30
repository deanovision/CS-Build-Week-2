import React, {useState, useEffect} from 'react';
import './App.css';
import axios from "axios"

let currentRoom;



function Traverse({setRoom, room, map, setMap}) {
  
  let oldRoom;
  let newRoom;
  let direction;
  let traverseMap = true
  let selfTraversal;
  const [reload, setReload] = useState(false)
  const timeout = room.cooldown * 1000 || 15 * 1000

  useEffect(()=>{
    console.log("UseEffect INIT")
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
        currentRoom = res.data
        setRoom(res.data)
      })
      .catch(err => {
        console.log(err.message);
      });
  },[])

  useEffect(()=>{
    console.log("UseEffect")
    setTimeout(()=>{
      setMoves()
    }, timeout)
  },[reload])

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
        // setRoom(res.data)
        return res.data
      })
      .catch(err => {
        console.log(err.message);
      });
  }

  function getMove(exits){
    if(!exits){
      // setTimeout(()=>{
      //   console.log("timeout", timeout)
      //   // setMoves(room)
      //   setReload(!reload)
      // }, timeout)
      console.log("NO EXITS", room)
    }else{
      if(exits.includes("n")){
        return ["n", "s"]
      }else if(exits.includes("w")){
        return ["w", "e"]
      }else if(exits.includes("e")){
        return ["e", "w"]
      }else if(exits.includes("s")){
        return ["s", "n"]
      }else {
        return null
      }
    }
  }


  function updateMap(room, direction){
    console.log("inside updateMap", room)
    let id = room.room_id.toString()
    console.log(id)
    for(let i=0; i<room.exits.length; i++){
      console.log("mapID", map[id])
      if(map[id] === undefined){
        if(i===0){
          setMap({
            ...map, [id]:{[room.exits[i]] : "?", title: room.title, messages: room.messages}
          })
          // setMap(prevMap => ({
          //   ...prevMap, [oldRoom]: {...prevMap[oldRoom], [direction[0]]: newRoom},
          //   [newRoom]: {...prevMap[newRoom], [direction[1]]: oldRoom}
          // }))
          // map[id] = {[room.exits[i]]: "?"}
          console.log("IF map",map)
        }else{
          setMap(prevMap => ({...prevMap, [id]: {...prevMap[id], [room.exits[i]]:"?"}}))
          // setMap(prevMap => ({
          //   ...prevMap, [oldRoom]: {...prevMap[oldRoom], [direction[0]]: newRoom},
          //   [newRoom]: {...prevMap[newRoom], [direction[1]]: oldRoom}
          // }))
          console.log("ELSE MAP", map)
        }

      }
      // else{

      // }
    }
    // console.log("MAP", map)
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

  async function setMoves(){
    let data;
    cooldown.then(async()=>{
      let response = await move(direction[0])
      data = response
    })
    oldRoom = room.room_id
    direction = getMove(room.exits)
    console.log("before", direction, room)
    // const data = direction ? await move(direction[0]) : null
      console.log("fired", timeout)
      if(map[oldRoom]){
        if(map[oldRoom][direction[0]] === "?"){
          newRoom = data.room_id
          console.log("data",oldRoom, newRoom)
          updateMap(data, direction)
          addMapData()
          setRoom(data) 
        }
      } else if(direction) {
          newRoom = data.room_id
          console.log("data",oldRoom, newRoom)
          updateMap(data, direction)
          addMapData()
          setRoom(data) 
      }


    // const data = await move(direction[0])
    // newRoom = data.room_id
    // console.log("data",oldRoom, newRoom)
    // updateMap(data, direction)
    // setRoom(data) 
  }

  function addMapData(){
    setMap(prevMap => ({
      ...prevMap, [oldRoom]: {...prevMap[oldRoom], [direction[0]]: newRoom},
      [newRoom]: {...prevMap[newRoom], [direction[1]]: oldRoom}
    }))
  }

  // const moveInterval = setInterval(()=>{
  //   move(setMoves())
  //   console.log("fired")
  // }, timeout)

  function clear(){
    window.clearInterval(selfTraversal)
  }
  console.log("MAP>>", map)
  console.log("Room>>", room)
  return (
    <div className="App">
      
        <h1>{room.title ? room.title : null}</h1>
      <h3>{room ? room.room_id: null}</h3>
      <h3>{room.description ? room.description: null}</h3>
      <h3>{room.cooldown ? room.cooldown : null}</h3>
      <div>{room.messages ? room.messages.map(message => {
        return <p>{message}</p>
      }) : null}</div>
      <button onClick={()=> setMoves()}>START</button>
      <button onClick={()=> clear()}>STOP</button>
      

    </div>
  );
}

export default Traverse;
