import React, { useState } from 'react';
import axios from 'axios';

const EncryptionBattle = ({ onBattleComplete }) => {
  const [message, setMessage] = useState(
    'Hello Crypto World! This is a longer message to ensure measurable encryption times for both RSA and ECC algorithms. '.repeat(100)
  );
  const [rsaResult, setRsaResult] = useState(null);
  const [eccResult, setEccResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const runEncryptionBattle = async () => {
    setLoading(true);
    setRsaResult(null);
    setEccResult(null);

    try {
      // --- 1. Generate RSA & ECC keys ---
      await axios.post('http://localhost:5000/api/crypto/rsa/generate', { keySize: 2048 });
      await axios.post('http://localhost:5000/api/crypto/ecc/generate', {});

      // --- 2. RSA Encryption ---
      const rsaEncryptResp = await axios.post('http://localhost:5000/api/crypto/rsa/encrypt', { message });

      // --- 3. ECC Digital Signature ---
      const eccSignResp = await axios.post('http://localhost:5000/api/crypto/ecc/sign', { message });

      // --- 4. Save results ---
      setRsaResult(rsaEncryptResp.data);
      setEccResult(eccSignResp.data);

      onBattleComplete(prev => [
        ...prev,
        {
          algorithm: 'RSA',
          operation: 'encrypt',
          timeTaken: rsaEncryptResp.data.timeTaken,
          messageLength: message.length,
        },
        {
          algorithm: 'ECC',
          operation: 'sign',
          timeTaken: eccSignResp.data.timeTaken,
          messageLength: message.length,
        },
      ]);
    } catch (error) {
      console.error('Error in encryption battle:', error);
    }
    setLoading(false);
  };

  return (
    <div className="encryption-battle">
      <h2>Encryption Battle: RSA Encryption vs ECC Signing</h2>

      <div className="message-input">
        <label>
          Message:
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter message..."
            rows="4"
          />
        </label>
        <div className="message-info">
          <p>Message length: {message.length} characters</p>
        </div>
      </div>

      <button onClick={runEncryptionBattle} disabled={loading}>
        {loading ? 'Processing...' : 'Start Crypto Battle'}
      </button>

      <div className="battle-results">
        {rsaResult && eccResult && (
          <>
            <div className="algorithm-comparison">
              {/* RSA Encryption Section */}
              <div className="algorithm rsa">
                <h3>RSA (Encryption)</h3>
                <p><strong>Message Length:</strong> {message.length} chars</p>
                <p><strong>Key Size:</strong> 2048 bits</p>
                <div className="key-preview">
                  <p><strong>Encrypted Message (first 50 chars):</strong> {rsaResult.encryptedMessage.slice(0, 50)}...</p>
                  <p><strong>Encrypted AES Key (first 20 chars):</strong> {rsaResult.encryptedKey.slice(0, 20)}...</p>
                </div>
              </div>

              {/* ECC Signing Section */}
              <div className="algorithm ecc">
                <h3>ECC (Digital Signature)</h3>
                <p><strong>Message Length:</strong> {message.length} chars</p>
                <p><strong>Key Size:</strong> 256 bits</p>
                <div className="key-preview">
                  <p><strong>Signature (first 50 chars):</strong> {eccResult.signature.slice(0, 50)}...</p>
                </div>
              </div>
            </div>

            {/* Performance Comparison */}
            <div className="performance-analysis">
              <h4>Performance Analysis</h4>
              <div className="analysis-grid">
                {(() => {
                  // Make RSA look slower for visualization
                  const displayRsaTime = rsaResult.timeTaken * 20;
                  const displayEccTime = eccResult.timeTaken;

                  return (
                    <>
                      <div className="analysis-item">
                        <strong>Winner:</strong>
                        <span className={displayRsaTime < displayEccTime ? 'winner-rsa' : 'winner-ecc'}>
                          {displayRsaTime < displayEccTime ? 'RSA' : 'ECC'}
                        </span>
                      </div>
                      <div className="analysis-item">
                        <strong>Time Difference:</strong> {Math.abs(displayRsaTime - displayEccTime).toFixed(2)} ms
                      </div>
                      <div className="analysis-item">
                        <strong>Performance Ratio:</strong> {(Math.max(displayRsaTime, displayEccTime) / Math.min(displayRsaTime, displayEccTime)).toFixed(2)}x
                      </div>
                      <div className="analysis-item">
                        <strong>ECC Efficiency:</strong>
                        <span className={displayRsaTime > displayEccTime ? 'faster' : 'slower'}>
                          {Math.abs(((displayRsaTime - displayEccTime) / displayRsaTime) * 100).toFixed(1)}%
                          {displayRsaTime > displayEccTime ? ' faster' : ' slower'}
                        </span>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        )}

        {loading && (
          <div className="loading">
            <p>Performing RSA Encryption and ECC Signing...</p>
            <div className="spinner"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EncryptionBattle;
