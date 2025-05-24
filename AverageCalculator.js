import React, { useState, useCallback } from 'react';
import './AverageCalculator.css';

function AverageCalculator() {
  const [numberType, setNumberType] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [requestHistory, setRequestHistory] = useState([]);

  const fetchNumbers = useCallback(async (type) => {
    setLoading(true);
    setError('');
    
    try {
      const startTime = Date.now();
      const response = await fetch(`http://localhost:9876/numbers/${type}`);
      const endTime = Date.now();
      
      if (!response.ok) {
        throw new Error('Failed to fetch numbers');
      }
      
      const data = await response.json();
      setResult(data);
      
      // Add to request history
      setRequestHistory(prev => [{
        type,
        timestamp: new Date().toLocaleTimeString(),
        responseTime: endTime - startTime,
        data
      }, ...prev].slice(0, 5)); // Keep last 5 requests
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (numberType) {
      fetchNumbers(numberType);
    }
  };

  const getNumberTypeLabel = (type) => {
    switch(type) {
      case 'p': return 'Prime Numbers';
      case 'f': return 'Fibonacci Numbers';
      case 'e': return 'Even Numbers';
      case 'r': return 'Random Numbers';
      default: return '';
    }
  };

  return (
    <div className="average-calculator">
      <h2>Number Type Average Calculator</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="numberType">Select Number Type:</label>
          <select
            id="numberType"
            value={numberType}
            onChange={(e) => setNumberType(e.target.value)}
            required
          >
            <option value="">Select a type</option>
            <option value="p">Prime Numbers</option>
            <option value="f">Fibonacci Numbers</option>
            <option value="e">Even Numbers</option>
            <option value="r">Random Numbers</option>
          </select>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Calculate Average'}
        </button>
      </form>
      
      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="result">
          <h3>Results for {getNumberTypeLabel(numberType)}</h3>
          <div className="result-section">
            <h4>Previous Window State:</h4>
            <p>{JSON.stringify(result.windowPrevState)}</p>
          </div>
          <div className="result-section">
            <h4>Current Window State:</h4>
            <p>{JSON.stringify(result.windowCurrState)}</p>
          </div>
          <div className="result-section">
            <h4>Numbers Received:</h4>
            <p>{JSON.stringify(result.numbers)}</p>
          </div>
          <div className="result-section">
            <h4>Average:</h4>
            <p>{result.avg.toFixed(2)}</p>
          </div>
        </div>
      )}

      {requestHistory.length > 0 && (
        <div className="request-history">
          <h3>Recent Requests</h3>
          <div className="history-list">
            {requestHistory.map((req, index) => (
              <div key={index} className="history-item">
                <div className="history-header">
                  <span>{getNumberTypeLabel(req.type)}</span>
                  <span className="timestamp">{req.timestamp}</span>
                </div>
                <div className="history-details">
                  <span>Response Time: {req.responseTime}ms</span>
                  <span>Average: {req.data.avg.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AverageCalculator; 