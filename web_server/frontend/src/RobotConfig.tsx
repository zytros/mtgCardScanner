import React, { useState } from 'react';

export function RobotConfig() {
  const [port, setPort] = useState<string>('/dev/ttyACM0');
  const [baudrate, setBaudrate] = useState<number>(9600);
  const [binsCount, setBinsCount] = useState<number>(10);
  const [servoAngle, setServoAngle] = useState<number>(90);

  const handleSaveRobotConfig = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Robot configuration saved successfully (Placeholder)');
  };

  const handleTestServo = async () => {
    try {
      alert(`Testing servo at angle ${servoAngle}° (Placeholder command)`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="main-content">
      <div className="header-bar">
        <h2>Robot Hardware Configuration</h2>
        <div className="status-badge status-stopped">PLACEHOLDER</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card-panel" style={{ alignItems: 'flex-start' }}>
          <h3>Serial Communication Settings</h3>
          <form onSubmit={handleSaveRobotConfig} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Serial Port</label>
              <input
                type="text"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="/dev/ttyACM0 or COM3"
              />
            </div>
            <div>
              <label>Baud Rate</label>
              <select
                value={baudrate}
                onChange={(e) => setBaudrate(Number(e.target.value))}
                style={{ width: '100%', padding: '8px', backgroundColor: '#0d1117', border: '1px solid #30363d', color: '#fafafa', borderRadius: '6px', marginTop: '5px' }}
              >
                <option value={9600}>9600</option>
                <option value={19200}>19200</option>
                <option value={38400}>38400</option>
                <option value={57600}>57600</option>
                <option value={115200}>115200</option>
              </select>
            </div>
            <div>
              <label>Number of Sorting Bins</label>
              <input
                type="number"
                value={binsCount}
                onChange={(e) => setBinsCount(parseInt(e.target.value) || 1)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '10px' }}>
              Save Hardware Config
            </button>
          </form>
        </div>

        <div className="card-panel" style={{ alignItems: 'flex-start' }}>
          <h3>Hardware Calibration & Diagnostics</h3>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div>
              <label>Test Servo Angle: {servoAngle}°</label>
              <input
                type="range"
                min="0"
                max="180"
                value={servoAngle}
                onChange={(e) => setServoAngle(Number(e.target.value))}
                style={{ width: '100%', marginTop: '5px' }}
              />
            </div>
            <button className="btn" onClick={handleTestServo}>
              Test Servo Position
            </button>

            <hr style={{ borderColor: '#30363d', width: '100%', margin: '10px 0' }} />

            <div>
              <h4>Stepper Motor Test</h4>
              <p style={{ color: '#8b949e', fontSize: '0.9rem' }}>
                Run calibration routines to zero axes and test card drop mechanism.
              </p>
              <button className="btn btn-danger" onClick={() => alert('Emergency Stop / Reset triggered (Placeholder)')}>
                Reset / Home Mechanism
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
