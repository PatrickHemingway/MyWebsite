import React, { useEffect, useState } from 'react';

const DuckTable = () => {
  const [ducks, setDucks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDucks = () => {
    fetch('http://localhost:3001/ducks')
      .then((res) => res.json())
      .then((data) => {
        setDucks(data);
        setLoading(false);
        
      });
  };

  useEffect(() => {
    setTimeout(() => {
        fetchDucks();
    }, 1000);
  }, []);

  const addLoss = async (id) => {
    await fetch(`http://localhost:3001/ducks/${id}/loss`, {
      method: 'PATCH',
    });
    fetchDucks();
  };

  const markWin = async (id) => {
    const response = await fetch(`http://localhost:3001/ducks/${id}/win`, {
      method: 'PATCH',
    });
  
    // Use returned duck list to update UI directly
    const updatedDucks = await response.json();
    setDucks(updatedDucks);
  };

  const resetAll = async () => {
    const response = await fetch('http://localhost:3001/ducks/reset', {
      method: 'PATCH',
    });
    const updatedDucks = await response.json();
    setDucks(updatedDucks);
  };

  const copyStats = () => {
    const totalAdjusted = ducks.reduce((sum, duck) => sum + (duck.losses + 1), 0);
  
    let statText = '.       Win Probability\n';
    ducks.forEach((duck) => {
      const adjusted = duck.losses + 1;
      const prob = ((adjusted / totalAdjusted) * 100).toFixed(0); // Round to nearest %
      statText += `${duck.name}:       ${prob}%\n`;
    });
  
    navigator.clipboard.writeText(statText).catch((err) => {
        console.error('Copy failed:', err);
    });
  };

  if (loading) return <p>Loading...</p>;

  const totalDucks = ducks.length;

  // Example: Invert losses to make ducks with more losses "due" for a win
  const totalAdjusted = ducks.reduce((sum, duck) => sum + (duck.losses + 1), 0);

  return (
    <div>
      <h2 style={{ textAlign: 'left' }}>Ducks and Their Losses</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Losses</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Win Probability</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ducks.map((duck) => {
            const adjustedLoss = duck.losses + 1; // more losses = more "urgency"
            const winProb = ((adjustedLoss / totalAdjusted) * 100).toFixed(2);
            return (
              <tr key={duck.id}>
                <td style={{ padding: '8px' }}>{duck.name}</td>
                <td style={{ padding: '8px' }}>{duck.losses}</td>
                <td style={{ padding: '8px' }}>{winProb}%</td>
                <td style={{ padding: '8px' }}>
                  <button onClick={() => addLoss(duck.id)} style={{ marginRight: '8px' }}>
                    Add Loss
                  </button>
                  <button onClick={() => markWin(duck.id)}>
                    Win
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div style={{ marginTop: '1rem', textAlign: 'left' }}>
            <button onClick={resetAll}>🔄 Reset All Losses</button>
            <button onClick={copyStats}>📋 Copy Stats</button>
        </div>
    </div>
  );
};

export default DuckTable;