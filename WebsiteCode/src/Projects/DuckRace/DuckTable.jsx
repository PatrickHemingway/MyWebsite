import React, { useEffect, useState } from 'react';

const DuckTable = () => {
    const [ducks, setDucks] = useState([]);
    const [races, setRaces] = useState([]);
    const [selectedRaceId, setSelectedRaceId] = useState(null);
    const [newRaceName, setNewRaceName] = useState('');
    const [totalRaces, setTotalRaces] = useState(0);


    const fetchRaces = async (attemptedCreate = false) => {
        const res = await fetch('http://localhost:3001/races');
        const data = await res.json();
      
        if (data.length === 0 && !attemptedCreate) {
          // Try to create the first race only once
          const defaultName = "Race1";
          const createRes = await fetch('http://localhost:3001/races', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: defaultName }),
          });
      
          if (createRes.ok) {
            return fetchRaces(true); // try again after creation
          } else {
            console.error("Failed to create initial race");
            return;
          }
        }
      
        setRaces(data);
        if (!selectedRaceId && data.length > 0) {
          setSelectedRaceId(data[0].id);
        }
      };

      const fetchDucks = () => {
        if (!selectedRaceId) return;
        fetch(`http://localhost:3001/races/${selectedRaceId}/ducks`)
          .then((res) => res.json())
          .then(({ ducks, totalRaces}) => {
            setDucks(ducks);
            setTotalRaces(totalRaces);
          });
      };      
      
      useEffect(() => {
        fetchRaces();
      }, []);      

      useEffect(() => {
        if (selectedRaceId) {
          fetchDucks();
        }
      }, [selectedRaceId]);      

  const addLoss = async (id) => {
    await fetch(`http://localhost:3001/races/${selectedRaceId}/ducks/${id}/loss`, {
      method: 'PATCH',
    });
    fetchDucks();
  };

  const markWin = async (id) => {
    const response = await fetch(`http://localhost:3001/races/${selectedRaceId}/ducks/${id}/win`, {
      method: 'PATCH',
    });
  
    // Use returned duck list to update UI directly
    const updatedDucks = await response.json();
    setDucks(updatedDucks);
  };

  const resetAll = async () => {
    const response = await fetch(`http://localhost:3001/races/${selectedRaceId}/reset`, {
      method: 'PATCH',
    });
    const updatedDucks = await response.json();
    setDucks(updatedDucks);
  };

const addDuck = async () => {
  const duckNumber = ducks.length + 1;
  const name = `Duck${duckNumber}`;
  await fetch(`http://localhost:3001/races/${selectedRaceId}/ducks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  fetchDucks(); // Consistent, safe
};


  const copyStats = () => {
    const totalAdjusted = ducks.reduce((sum, duck) => sum + (duck.losses + 1), 0);
  
    let statText = '.       Win Probability    Win Rate\n';
    ducks.forEach((duck) => {
      const adjusted = duck.losses + 1;
      const prob = ((adjusted / totalAdjusted) * 100).toFixed(0); // Round to nearest %
      const winRate = totalRaces ? ((duck.wins / totalRaces) * 100).toFixed(0) + '%' : '-';
      statText += `${duck.name}:       ${prob}%                 ${winRate}\n`;
    });
  
    navigator.clipboard.writeText(statText).catch((err) => {
      console.error('Copy failed:', err);
    });
  };
  

  if (!selectedRaceId) return <p>Loading or initializing first race...</p>;

  const totalDucks = ducks.length;

  // Example: Invert losses to make ducks with more losses "due" for a win
  const totalAdjusted = ducks.reduce((sum, duck) => sum + (duck.losses + 1), 0);

  return (
    <div>
      <h2 style={{ textAlign: 'left' }}>Race {selectedRaceId}: Ducks and Their Losses</h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <select
                value={selectedRaceId || ''}
                onChange={(e) => setSelectedRaceId(Number(e.target.value))}
            >
                {races.map(race => (
                <option key={race.id} value={race.id}>
                    {race.name}
                </option>
                ))}
            </select>

            <input
                type="text"
                placeholder="New race name"
                value={newRaceName}
                onChange={(e) => setNewRaceName(e.target.value)}
            />

            <button
                onClick={async () => {
                if (!newRaceName.trim()) return;
                await fetch('http://localhost:3001/races', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: newRaceName }),
                });
                setNewRaceName('');
                fetchRaces(); // refresh race list
                }}
            >
                ➕ Add Race
            </button>
            <button
                onClick={async () => {
                if (!selectedRaceId) return;
                    await fetch(`http://localhost:3001/races/${selectedRaceId}`, {
                        method: 'DELETE',
                    });
                    setSelectedRaceId(null);
                    fetchRaces();
                }}
            >
                🗑️ Delete Race
            </button>
        </div>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Losses</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Win Probability</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Win Rate</th>
            <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {ducks.map((duck) => {
            const adjustedLoss = duck.losses + 1; // more losses = more "urgency"
            const winProb = ((adjustedLoss / totalAdjusted) * 100).toFixed(2);
            const winRate = totalRaces ? ((duck.wins / totalRaces) * 100).toFixed(1) + '%' : '-';
            return (
              <tr key={duck.id}>
                <td style={{ padding: '8px' }}>{duck.name}</td>
                <td style={{ padding: '8px' }}>{duck.losses}</td>
                <td style={{ padding: '8px' }}>{winProb}%</td>
                <td style={{ padding: '8px' }}>{winRate}</td>
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
            <button onClick={addDuck}>🦆 Add Duck</button>
        </div>
    </div>
  );
};

export default DuckTable;