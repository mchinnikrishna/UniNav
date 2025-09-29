import React from 'react';
import '../../Assets/css/CurrentLocationButton.css'; // Make sure this path matches your project structure

const CurrentLocationButton: React.FC<{ onClick: () => void }> = ({ onClick }) => {
    return (
        <button className="Btn" onClick={onClick}>
            Current Location
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="svg"
            >
                <path
                    d="M224 0C125 0 45 93 45 208c0 140 179 291 179 291s179-151 179-291C403 93 323 0 224 0zm0 122c-47.1 0-85 37.9-85 85s37.9 85 85 85 85-37.9 85-85-37.9-85-85-85z"
                    style={{fill: 'none', stroke: 'white', strokeWidth: 55}}
                />
            </svg>

        </button>
    );
};

export default CurrentLocationButton;
