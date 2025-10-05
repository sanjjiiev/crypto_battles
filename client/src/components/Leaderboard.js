import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
    fetchStats();
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/battle/leaderboard');
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/battle/stats');
      setStats(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading leaderboard data...</div>;
  }

  return (
    <div className="leaderboard">
      <h2>Crypto Algorithms Leaderboard</h2>
      
      <div className="stats-overview">
        <h3>Performance Statistics</h3>
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <h4>{stat._id}</h4>
              <p>Total Operations: {stat.totalOperations}</p>
              <p>Average Time: {stat.averageTime?.toFixed(2)} ms</p>
              <p>Fastest: {stat.fastestTime?.toFixed(2)} ms</p>
              <p>Slowest: {stat.slowestTime?.toFixed(2)} ms</p>
            </div>
          ))}
        </div>
      </div>

      <div className="charts-section">
        <h3>Performance Comparison</h3>
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={leaderboardData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgKeyGenTime" fill="#8884d8" name="Avg Key Generation Time (ms)" />
              <Bar dataKey="avgEncryptTime" fill="#82ca9d" name="Avg Encryption Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="educational-insights">
        <h3>Key Insights</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Speed Advantage</h4>
            <p>ECC typically generates keys and performs operations faster than RSA for equivalent security levels.</p>
          </div>
          <div className="insight-card">
            <h4>Key Size Efficiency</h4>
            <p>A 256-bit ECC key provides similar security to a 3072-bit RSA key, making ECC more storage-efficient.</p>
          </div>
          <div className="insight-card">
            <h4>Resource Usage</h4>
            <p>ECC requires less computational power and memory, making it ideal for mobile and IoT devices.</p>
          </div>
          <div className="insight-card">
            <h4>Adoption Trends</h4>
            <p>Modern systems are increasingly adopting ECC due to its efficiency and stronger security per bit.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;