import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import { RobotConfig } from './RobotConfig';

const API_BASE = 'http://localhost:5050/api';

interface CardEntry {
  card_name: string;
  card_price: number;
  bin: number;
  card_nr: number;
}

function App() {
  const [running, setRunning] = useState<boolean>(false);
  const [setCode, setSetCode] = useState<string>('neo');
  const [criteria, setCriteria] = useState<string>('cmc');
  const [cameraIndex, setCameraIndex] = useState<number>(0);
  const [cardCount, setCardCount] = useState<number>(0);
  const [lastEntry, setLastEntry] = useState<CardEntry | null>(null);
  const [imageTimestamp, setImageTimestamp] = useState<number>(Date.now());
  const [activePage, setActivePage] = useState<'control' | 'config'>('control');

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${API_BASE}/status`);
        setRunning(res.data.running);
        if (res.data.set_code) setSetCode(res.data.set_code);
        if (res.data.criteria) setCriteria(res.data.criteria);
        if (res.data.camera_index !== undefined) setCameraIndex(res.data.camera_index);
        setCardCount(res.data.card_count || 0);
        if (res.data.last_entry) setLastEntry(res.data.last_entry);
      } catch (err) {
        console.error('Failed to fetch status', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleApplyConfig = async () => {
    try {
      await axios.post(`${API_BASE}/config`, { set_code: setCode, camera_index: cameraIndex });
      alert('Configuration updated successfully');
    } catch (err) {
      console.error(err);
      alert('Failed to update config');
    }
  };

  const handleSetCriteria = async (newCriteria: string) => {
    setCriteria(newCriteria);
    try {
      await axios.post(`${API_BASE}/config`, { criteria: newCriteria });
    } catch (err) {
      console.error(err);
    }
  };

  const handleStart = async () => {
    try {
      await axios.post(`${API_BASE}/start`);
      setRunning(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStop = async () => {
    try {
      await axios.post(`${API_BASE}/stop`);
      setRunning(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCapture = async () => {
    try {
      const res = await axios.post(`${API_BASE}/capture`);
      if (res.data.entry) setLastEntry(res.data.entry);
      setImageTimestamp(Date.now());
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetNextCard = async () => {
    try {
      await axios.post(`${API_BASE}/next_card`);
      setLastEntry(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveCSV = async () => {
    try {
      const res = await axios.post(`${API_BASE}/save`);
      alert(`Data saved to ${res.data.filename}`);
    } catch (err) {
      console.error(err);
      alert('Failed to save CSV');
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2>MTG Card Scanner</h2>

        <div>
          <label>Set Code</label>
          <input
            type="text"
            value={setCode}
            onChange={(e) => setSetCode(e.target.value)}
          />
          <button className="btn" style={{ marginTop: '8px', width: '100%' }} onClick={handleApplyConfig}>
            Apply Set Code
          </button>
        </div>

        <div>
          <label>Sorting Criteria (Active: {criteria.toUpperCase()})</label>
          <div className="btn-group" style={{ marginTop: '5px' }}>
            <button className={`btn ${criteria === 'cmc' ? 'btn-primary' : ''}`} onClick={() => handleSetCriteria('cmc')}>CMC</button>
            <button className={`btn ${criteria === 'color' ? 'btn-primary' : ''}`} onClick={() => handleSetCriteria('color')}>Color</button>
            <button className={`btn ${criteria === 'price' ? 'btn-primary' : ''}`} onClick={() => handleSetCriteria('price')}>Price</button>
          </div>
        </div>

        <div>
          <label>Camera Index</label>
          <input
            type="number"
            value={cameraIndex}
            onChange={(e) => setCameraIndex(parseInt(e.target.value) || 0)}
          />
          <button className="btn" style={{ marginTop: '8px', width: '100%' }} onClick={handleApplyConfig}>
            Reconnect Camera
          </button>
        </div>

        <hr style={{ borderColor: '#30363d', margin: '5px 0' }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label>Navigation</label>
          <button
            className={`btn ${activePage === 'control' ? 'btn-primary' : ''}`}
            onClick={() => setActivePage('control')}
            style={{ width: '100%', textAlign: 'left' }}
          >
            🎥 Live Control & Feed
          </button>
          <button
            className={`btn ${activePage === 'config' ? 'btn-primary' : ''}`}
            onClick={() => setActivePage('config')}
            style={{ width: '100%', textAlign: 'left' }}
          >
            ⚙️ Robot Configuration
          </button>
        </div>

        <hr style={{ borderColor: '#30363d', margin: '5px 0' }} />

        <div>
          <button className="btn" style={{ width: '100%' }} onClick={handleSaveCSV}>
            Save CSV ({cardCount} cards)
          </button>
        </div>
      </div>

      {activePage === 'config' ? (
        <RobotConfig />
      ) : (
        /* Main Content */
        <div className="main-content">
          {/* Header Control Bar */}
          <div className="header-bar">
            <div className="btn-group">
              <button className="btn btn-primary" onClick={handleStart} disabled={running}>Start</button>
              <button className="btn btn-danger" onClick={handleStop} disabled={!running}>Stop</button>
              <button className="btn" onClick={handleCapture}>Capture & Detect</button>
              <button className="btn" onClick={handleGetNextCard}>Get Next Card</button>
            </div>
            <div className={`status-badge ${running ? 'status-running' : 'status-stopped'}`}>
              {running ? 'RUNNING' : 'STOPPED'}
            </div>
          </div>

          {/* Video & Latest Card Grid */}
          <div className="grid-container">
            <div className="card-panel">
              <h3>Live Camera Feed</h3>
              <img
                src={`${API_BASE}/video_feed`}
                alt="Live Camera Feed"
                className="image-preview"
              />
            </div>

            <div className="card-panel">
              <h3>Latest Detected Card</h3>
              <img
                key={imageTimestamp}
                src={`${API_BASE}/latest_image?t=${imageTimestamp}`}
                alt="Latest Detected Card"
                className="image-preview"
              />
              {lastEntry ? (
                <div className="card-info">
                  <div><strong>Name:</strong> {lastEntry.card_name}</div>
                  <div><strong>Price:</strong> ${lastEntry.card_price}</div>
                  <div><strong>Bin:</strong> {lastEntry.bin}</div>
                  <div><strong>Card #:</strong> {lastEntry.card_nr}</div>
                </div>
              ) : (
                <div style={{ color: '#8b949e', marginTop: '10px' }}>No detected card yet</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
