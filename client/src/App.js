import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import KeyGenerator from './components/KeyGenerator';
import EncryptionBattle from './components/EncryptionBattle';
import ComparisonCharts from './components/ComparisonCharts';
import Leaderboard from './components/Leaderboard';

function App() {
  const [battleHistory, setBattleHistory] = useState([]);

  return (
    <Router>
      <div className="App">
        <Header />
        
        <Routes>
          <Route path="/" element={
            <div className="container">
              <h1>Crypto Battles: RSA vs ECC</h1>
              <p>Experience the battle between two cryptographic giants!</p>
              
              <div className="battle-ground">
                <KeyGenerator onBattleComplete={setBattleHistory} />
                <EncryptionBattle onBattleComplete={setBattleHistory} />
              </div>
            </div>
          } />
          <Route path="/compare" element={<ComparisonCharts />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;