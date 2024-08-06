import React from 'react';
import './InfoBox.css';

class UserGuidanceBox extends React.Component<{title:string, text:string}>{
    render() {
        return (
        <div className="info-box">
        <div className="info-box-icon">
            <span>i</span>
        </div>
        <div className="info-box-content">
            <strong>{this.props.title}</strong>
            <p>{this.props.text}</p>
        </div>
        </div>
    );
    }
}

export default UserGuidanceBox;