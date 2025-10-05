import React, { useState } from 'react';
import axios from 'axios';

const KeyGenerator = ({ onBattleComplete }) => {
  const [rsaKeys, setRsaKeys] = useState(null);
  const [eccKeys, setEccKeys] = useState(null);
  const [loading, setLoading] = useState(false);
  const [keySize, setKeySize] = useState(2048);

  const generateRSAKeys = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/crypto/rsa/generate', {
        keySize
      });
      
      setRsaKeys(response.data);
      onBattleComplete(prev => [...prev, {
        algorithm: 'RSA',
        operation: 'keygen',
        timeTaken: response.data.timeTaken,
        keySize
      }]);
    } catch (error) {
      console.error('Error generating RSA keys:', error);
    }
    setLoading(false);
  };

  const generateECCKeys = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/crypto/ecc/generate', {});
      
      setEccKeys(response.data);
      onBattleComplete(prev => [...prev, {
        algorithm: 'ECC',
        operation: 'keygen',
        timeTaken: response.data.timeTaken,
        keySize: 256
      }]);
    } catch (error) {
      console.error('Error generating ECC keys:', error);
    }
    setLoading(false);
  };

  return (
    <div className="key-generator">
      <h2>Key Generation Battle</h2>
      
      <div className="controls">
        <label>
          RSA Key Size:
          <select value={keySize} onChange={(e) => setKeySize(parseInt(e.target.value))}>
            <option value={1024}>1024 bits</option>
            <option value={2048}>2048 bits</option>
            <option value={4096}>4096 bits</option>
          </select>
        </label>
      </div>

      <div className="battle-actions">
        <button onClick={generateRSAKeys} disabled={loading}>
          Generate RSA Keys
        </button>
        <button onClick={generateECCKeys} disabled={loading}>
          Generate ECC Keys
        </button>
      </div>

      <div className="results">
        {rsaKeys && (
          <div className="algorithm-result rsa">
            <h3>RSA Results</h3>
            <p><strong>Time:</strong> {rsaKeys.timeTaken.toFixed(2)} ms</p>
            <p><strong>Key Size:</strong> {rsaKeys.keySize} bits</p>
            <div className="key-preview">
              <p>Public Key: {rsaKeys.publicKey}</p>
            </div>
          </div>
        )}

        {eccKeys && (
          <div className="algorithm-result ecc">
            <h3>ECC Results</h3>
            <p><strong>Time:</strong> {eccKeys.timeTaken.toFixed(2)} ms</p>
            <p><strong>Key Size:</strong> {eccKeys.keySize} bits</p>
            <div className="key-preview">
              <p>Public Key: {eccKeys.publicKey}</p>
            </div>
          </div>
        )}

        {rsaKeys && eccKeys && (
          <div className="battle-winner">
            <h3>Winner: {rsaKeys.timeTaken < eccKeys.timeTaken ? 'RSA' : 'ECC'}</h3>
            <p>Difference: {Math.abs(rsaKeys.timeTaken - eccKeys.timeTaken).toFixed(2)} ms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KeyGenerator;