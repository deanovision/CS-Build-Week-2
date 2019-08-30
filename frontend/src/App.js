import React, {useState} from 'react';
import './App.css';
import Move from './Move';


function App() {

  const [room, setRoom] = useState({})
  const [map, setMap] = useState({})

  return (
    <div className="App">
      <Move setRoom={setRoom} room={room} map={map} setMap={setMap} />     
    </div>
  );
}

export default App;
