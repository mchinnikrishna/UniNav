import React, { useEffect, useState } from 'react';
import { What3wordsAutosuggest, What3wordsMap } from '@what3words/react-components';
import { useWhat3Words } from '../context/What3WordsContext';
import CurrentLocationButton from '../Homepage/CurrentLocationButton'; // Import the CurrentLocationButton

const API_KEY = process.env.REACT_APP_WHAT3WORDS_API_KEY;
const MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

const What3WordsMapComponent: React.FC = () => {
    const { setSelectedW3words, setSelectedLatLng } = useWhat3Words();
    const [inputValue, setInputValue] = useState<string>('');

    const handleSquareSelect = async (event: any) => {
        const { lat, lng } = event.detail.coordinates;
        setSelectedLatLng({ lat, lng });
        setSelectedW3words(event.detail.words);
        setInputValue(event.detail.words);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setInputValue(value);
        setSelectedW3words(value);
        console.log(value);
    };

    useEffect(() => {
        const w3wMap = document.getElementById('w3w-map');
        if (w3wMap) {
            w3wMap.addEventListener('selected_square', handleSquareSelect);
        }
        return () => {
            if (w3wMap) {
                w3wMap.removeEventListener('selected_square', handleSquareSelect);
            }
        };
    }, []);

    return (
        <div className="w3w-map-component">
            <What3wordsMap
                id="w3w-map"
                api_key={API_KEY}
                map_api_key={MAP_API_KEY}
                disable_default_ui={true}
                fullscreen_control={true}
                map_type_control={true}
                zoom_control={true}
                current_location_control_position={9}
                fullscreen_control_position={3}
                search_control_position={2}
                words="filled.count.soap"
                className="fullscreen-map"
            >
                <div slot="map" style={{ width: "100%", height: "100%" }} />
                <div slot="search-control" style={{ margin: "10px 0 0 10px" }}>
                    <What3wordsAutosuggest>
                        <input
                            type="text"
                            placeholder="Find your address"
                            value={inputValue}
                            onChange={handleInputChange}
                            style={{ width: "250px" }}
                            autoComplete="off"
                        />
                    </What3wordsAutosuggest>
                </div>
                <div slot="current-location-control" style={{ margin: "0 10px 10px 0" }}>
                    <CurrentLocationButton onClick={() => handleSquareSelect({ detail: { coordinates: { lat: 0, lng: 0 }, words: '' } })} /> {/* Wrap handleSquareSelect */}
                </div>
            </What3wordsMap>
        </div>
    );
};

export default What3WordsMapComponent;