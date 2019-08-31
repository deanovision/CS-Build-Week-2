import React, {useState} from 'react';
import './App.css';
import Move from './Move';
import CoinMiner from './CoinMiner';


function App() {

  const [room, setRoom] = useState({})
  const [map, setMap] = useState({})

  return (
    <div className="App">
      <Move setRoom={setRoom} room={room} map={map} setMap={setMap} />    
      <CoinMiner /> 
    </div>
  );
}

export default App;
