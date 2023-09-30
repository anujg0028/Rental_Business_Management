import React from 'react';
import './SlideButton.css';

const SlideButton = ({ isOn = true, onChange }) => {
    const handleToggle = () => {
        onChange(!isOn);
    };

    return (
        <label className="slide-button">
            <input type="checkbox" checked={isOn} onChange={handleToggle} style={{ display: 'none' }} />
            <div className="slider round"></div>
            <span className="slider-text">All Time</span>
        </label>
    );
};

export default SlideButton;
