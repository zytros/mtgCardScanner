import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5050/api';

export function RobotConfig() {
  const [lightLevel, setLightLevel] = useState<number | null>(null);
  const [activeModule, setActiveModule] = useState<number>(1);
  const [pusherNeutral, setPusherNeutral] = useState<number>(90);
  const [statusMsg, setStatusMsg] = useState<string>('');

  const handleGetCard = async () => {
    try {
      setStatusMsg('Triggering get_card...');
      const res = await axios.post(`${API_BASE}/robot/get_card`);
      setStatusMsg(res.data.success ? 'get_card executed successfully' : 'get_card failed');
    } catch (err) {
      console.error(err);
      setStatusMsg('Error executing get_card');
    }
  };

  const handleGetLight = async () => {
    try {
      setStatusMsg('Reading light level on A0...');
      const res = await axios.get(`${API_BASE}/robot/light`);
      if (res.data.success) {
        setLightLevel(res.data.light);
        setStatusMsg(`Light level read: ${res.data.light}`);
      } else {
        setStatusMsg('Failed to read light level');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Error reading light level');
    }
  };

  const handleServoAction = async (action: string, moduleNum: number) => {
    if (moduleNum !== 1) {
      alert(`Sorting Module ${moduleNum} is currently a placeholder (only Module 1 is connected).`);
      return;
    }
    try {
      setStatusMsg(`Executing ${action} on Module ${moduleNum}...`);
      const res = await axios.post(`${API_BASE}/robot/${action}`);
      setStatusMsg(res.data.success ? `${action} executed successfully` : `${action} failed`);
    } catch (err) {
      console.error(err);
      setStatusMsg(`Error executing ${action}`);
    }
  };

  const handleNeutralAction = async (action: 'neutral_inc' | 'neutral_dec') => {
    try {
      setStatusMsg(`Adjusting pusher neutral (${action === 'neutral_inc' ? '+1°' : '-1°'})...`);
      const res = await axios.post(`${API_BASE}/robot/${action}`);
      if (res.data.success) {
        setPusherNeutral(res.data.neutral);
        setStatusMsg(`Pusher neutral set to ${res.data.neutral}°`);
      } else {
        setStatusMsg('Failed to adjust pusher neutral');
      }
    } catch (err) {
      console.error(err);
      setStatusMsg('Error adjusting pusher neutral');
    }
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <h2>Robot Hardware Configuration</h2>
        <div className="status-badge status-stopped">MODULE 1 ACTIVE / 3 MODULES PLACEHOLDER</div>
      </div>

      {statusMsg && (
        <div style={{ background: '#161b22', border: '1px solid #30363d', padding: '10px', borderRadius: '6px', marginBottom: '15px', color: '#58a6ff' }}>
          <strong>Status:</strong> {statusMsg}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Feed Module & Light Sensor */}
        <div className="card-panel" style={{ alignItems: 'flex-start' }}>
          <h3>Feed Module & Sensors</h3>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <h4>Feed Module Test</h4>
              <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                Test feeding mechanism by sending 'get_card' to Arduino.
              </p>
              <button className="btn btn-primary" onClick={handleGetCard} style={{ marginTop: '5px' }}>
                Test 'get_card'
              </button>
            </div>

            <hr style={{ borderColor: '#30363d', width: '100%', margin: '5px 0' }} />

            <div>
              <h4>Light Level Sensor (A0)</h4>
              <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                Read current light level detected on analog pin A0.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}>
                <button className="btn" onClick={handleGetLight}>
                  Read Light Level
                </button>
                {lightLevel !== null && (
                  <span style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#3fb950' }}>
                    A0: {lightLevel}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sorting Modules (Placeholder for up to 3 modules, Module 1 active) */}
        <div className="card-panel" style={{ alignItems: 'flex-start' }}>
          <h3>Sorting Modules (Up to 3)</h3>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  className={`btn ${activeModule === num ? 'btn-primary' : ''}`}
                  onClick={() => setActiveModule(num)}
                >
                  Module {num} {num === 1 ? '(Active)' : '(Placeholder)'}
                </button>
              ))}
            </div>

            <div style={{ background: '#0d1117', border: '1px solid #30363d', padding: '15px', borderRadius: '6px', width: '100%' }}>
              <h4>Sorting Module {activeModule} Control (3 Servos)</h4>
              {activeModule === 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <p style={{ color: '#8b949e', fontSize: '0.85rem' }}>
                    Test individual sorting mechanism functions:
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button className="btn" onClick={() => handleServoAction('open_sides', 1)}>
                      Open Sides
                    </button>
                    <button className="btn" onClick={() => handleServoAction('close_sides', 1)}>
                      Close Sides
                    </button>
                    <button className="btn" onClick={() => handleServoAction('open_bottom', 1)}>
                      Open Bottom
                    </button>
                    <button className="btn" onClick={() => handleServoAction('close_bottom', 1)}>
                      Close Bottom
                    </button>
                    <button className="btn" onClick={() => handleServoAction('push_left', 1)}>
                      Push Left
                    </button>
                    <button className="btn" onClick={() => handleServoAction('push_right', 1)}>
                      Push Right
                    </button>
                    <button className="btn" onClick={() => handleNeutralAction('neutral_dec')}>
                      -1° Neutral
                    </button>
                    <button className="btn" onClick={() => handleNeutralAction('neutral_inc')}>
                      +1° Neutral
                    </button>
                    <button className="btn btn-primary" style={{ gridColumn: 'span 2' }} onClick={() => handleServoAction('reset_pushers', 1)}>
                      Reset Pushers (Neutral: {pusherNeutral}°)
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ color: '#8b949e', marginTop: '10px', fontStyle: 'italic' }}>
                  Sorting Module {activeModule} hardware is not connected yet (Placeholder). Only Module 1 is active.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
