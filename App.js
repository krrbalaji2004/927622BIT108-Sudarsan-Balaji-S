import React from 'react';
import './App.css';
import AverageCalculator from './AverageCalculator';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Average Calculator Microservice</h1>
        <p className="subtitle">Calculate averages for different types of numbers</p>
      </header>
      <main>
        <AverageCalculator />
      </main>
      <footer className="App-footer">
        <p>Select a number type to calculate its average</p>
      </footer>
    </div>
  );
}

export default App;
