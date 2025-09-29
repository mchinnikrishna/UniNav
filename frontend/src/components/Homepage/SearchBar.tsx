import React, { useState, useRef, useEffect } from 'react';
import '../../Assets/css/SearchBar.css';
import { FaSearchLocation, FaMicrophone } from "react-icons/fa";

interface SearchBarProps {
    map: google.maps.Map | null;
    events: { id: string, name: string, latitude: number, longitude: number }[];
    onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
    onEventSelect?: (event: { id: string, name: string, latitude: number, longitude: number }) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ map, events, onPlaceSelect, onEventSelect }) => {
    const [isListening, setIsListening] = useState(false);
    const [searchText, setSearchText] = useState('');
    const recognitionRef = useRef<any>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [suggestions, setSuggestions] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value);
        const eventSuggestions = events
            .filter(event => event.name.toLowerCase().includes(e.target.value.toLowerCase()))
            .map(event => event.name);

        if (e.target.value) {
            const service = new window.google.maps.places.AutocompleteService();
            service.getPlacePredictions({ input: e.target.value }, (predictions) => {
                if (predictions) {
                    const placeSuggestions = predictions.map(prediction => prediction.description);
                    setSuggestions([...eventSuggestions, ...placeSuggestions]);
                } else {
                    setSuggestions(eventSuggestions);
                }
            });
        } else {
            setSuggestions([]);
        }
    };

    const handleSuggestionClick = (suggestion: string) => {
        const event = events.find(event => event.name === suggestion);
        if (event && onEventSelect) {
            onEventSelect(event);
        } else {
            const service = new window.google.maps.places.PlacesService(map!);
            service.findPlaceFromQuery({ query: suggestion, fields: ['geometry'] }, (results, status) => {
                if (status === window.google.maps.places.PlacesServiceStatus.OK && results && results[0]) {
                    const place = results[0];
                    if (place.geometry?.location) {
                        map?.panTo(place.geometry.location);
                        map?.setZoom(15);
                        if (onPlaceSelect) {
                            onPlaceSelect(place);
                        }
                    }
                }
            });
        }
        setSearchText(suggestion);
        setSuggestions([]);
    };

    return (
        <form action="#" className="search" onSubmit={(e) => e.preventDefault()}>
            <button type="button" className="search__button">
                <div className="search__icon">
                    <FaSearchLocation size={20} />
                </div>
            </button>
            <input
                ref={searchInputRef}
                type="text"
                className="search__input"
                placeholder="Search locations or events..."
                value={searchText}
                onChange={handleInputChange}
                autoComplete="off"  // Disable default autocomplete
            />
            <button
                type="button"
                className={`mic__button ${isListening ? 'listening' : ''}`}
                onClick={() => setIsListening(!isListening)}
            >
                <div className="mic__icon">
                    <FaMicrophone size={20} />
                </div>
            </button>
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default SearchBar;