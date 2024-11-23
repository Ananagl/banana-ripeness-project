import React from 'react';
import PredictBanana from './PredictBanana';
import './App.css';

function App() {
  return (
    <div className="App p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Sistema de Predicción de Maduración de Bananas</h1>
      <PredictBanana />
    </div>
  );
}

export default App;

