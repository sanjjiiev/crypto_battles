import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ComparisonCharts = () => {
  const [comparisonData, setComparisonData] = useState([]);
  const [keySizeData, setKeySizeData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparisonData();
    generateKeySizeData();
  }, []);

  const fetchComparisonData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/battle/compare');
      setComparisonData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      setLoading(false);
    }
  };

  const generateKeySizeData = () => {
    // Mock data for key size vs security level comparison
    const data = [
      { algorithm: 'RSA', security: 80, keySize: 1024 },
      { algorithm: 'RSA', security: 112, keySize: 2048 },
      { algorithm: 'RSA', security: 128, keySize: 3072 },
      { algorithm: 'RSA', security: 192, keySize: 7680 },
      { algorithm: 'RSA', security: 256, keySize: 15360 },
      { algorithm: 'ECC', security: 80, keySize: 160 },
      { algorithm: 'ECC', security: 112, keySize: 224 },
      { algorithm: 'ECC', security: 128, keySize: 256 },
      { algorithm: 'ECC', security: 192, keySize: 384 },
      { algorithm: 'ECC', security: 256, keySize: 512 },
    ];
    setKeySizeData(data);
  };

  const COLORS = ['#0088FE', '#00C49F'];

  if (loading) {
    return <div className="loading">Loading comparison data...</div>;
  }

  return (
    <div className="comparison-charts">
      <h2>Algorithm Comparison Dashboard</h2>
      
      <div className="charts-grid">
        <div className="chart-container">
          <h3>Key Size vs Security Level</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={keySizeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="keySize" 
                name="Key Size (bits)"
                label={{ value: 'Key Size (bits)', position: 'insideBottom', offset: -4 }}
              />
              <YAxis 
                label={{ value: 'Security Level (bits)', angle: -90, position: 'Outside', offset: 70  }}
              />
              <Tooltip />
              <Legend />
              <p></p>
              <Line 
                type="monotone" 
                dataKey="security" 
                stroke="#8884d8" 
                name="Security Level (bits)"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Performance Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.operation" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="avgTime" fill="#8884d8" name="Average Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Key Size Efficiency</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: 'RSA 2048-bit', value: 2048 },
                  { name: 'ECC 256-bit', value: 256 }
                ]}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}\n${value} bits`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                <Cell fill={COLORS[0]} />
                <Cell fill={COLORS[1]} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Operation Speed Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id.algorithm" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="minTime" fill="#82ca9d" name="Fastest Time (ms)" />
              <Bar dataKey="maxTime" fill="#ff8042" name="Slowest Time (ms)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="educational-content">
        <h3>Why ECC is More Efficient</h3>
        <div className="points">
          <div className="point">
            <h4>Smaller Key Sizes</h4>
            <p>ECC provides the same security as RSA with much smaller key sizes. A 256-bit ECC key is equivalent to a 3072-bit RSA key in security.</p>
          </div>
          <div className="point">
            <h4>Mathematical Foundation</h4>
            <p>ECC security is based on the elliptic curve discrete logarithm problem, which is exponentially harder to solve than RSA's factorization problem.</p>
          </div>
          <div className="point">
            <h4>Performance</h4>
            <p>ECC operations are generally faster than RSA operations for equivalent security levels, especially for key generation and digital signatures.</p>
          </div>
          <div className="point">
            <h4>Resource Efficiency</h4>
            <p>ECC requires less computational power, memory, and bandwidth, making it ideal for constrained environments like mobile devices and IoT.</p>
          </div>
        </div>
      </div>

      <div className="security-comparison">
        <h3>Security Level Comparison</h3>
        <table className="security-table">
          <thead>
            <tr>
              <th>Security Level (bits)</th>
              <th>RSA Key Size</th>
              <th>ECC Key Size</th>
              <th>Size Ratio</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>80</td>
              <td>1024</td>
              <td>160</td>
              <td>6.4:1</td>
            </tr>
            <tr>
              <td>112</td>
              <td>2048</td>
              <td>224</td>
              <td>9.1:1</td>
            </tr>
            <tr>
              <td>128</td>
              <td>3072</td>
              <td>256</td>
              <td>12:1</td>
            </tr>
            <tr>
              <td>192</td>
              <td>7680</td>
              <td>384</td>
              <td>20:1</td>
            </tr>
            <tr>
              <td>256</td>
              <td>15360</td>
              <td>512</td>
              <td>30:1</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonCharts;