import React, {useState, useEffect, useRef, useCallback, useContext} from 'react';
import './../Assets/css/MapComponent.css';
import Tabs from './Homepage/Tabs';
import PostButton from './Homepage/PostButton';
import { GoogleMap, InfoWindow, Libraries, useLoadScript } from '@react-google-maps/api';
import CurrentLocationButton from './Homepage/CurrentLocationButton';
import WeatherCard from './Homepage/WeatherCard';
import { EventContext } from "./context/EventContext";
import { Event } from "./types/Event";
import EventCard from "./Events/EventCard";
import SearchBar from "./Homepage/SearchBar";
import {useUser} from "@clerk/clerk-react";


const MAP_API_KEY = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
const WEATHER_API_KEY = process.env.REACT_APP_WEATHER_API_KEY;
const libraries: Libraries = ["marker", "maps", "places"];

const defaultCenter = {
    lat: 37.7749,
    lng: -122.4194,
};

const MapComponent: React.FC = () => {
    const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [selectedLatLng, setSelectedLatLng] = useState<{ lat: number, lng: number } | null>(null);
    const [weatherData, setWeatherData] = useState<any>(null);
    const [isWeatherPopupVisible, setIsWeatherPopupVisible] = useState(false);
    const [isLoadingWeather, setIsLoadingWeather] = useState(false);
    const [weatherError, setWeatherError] = useState<string | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const events = useContext(EventContext);
    const [showEventCard, setShowEventCard] = useState<boolean>(false);
    const [currentEvent, setCurrentEvent] = useState<Event | undefined>(undefined);
    const [eventPosition, setEventPosition] = useState<{ lat: number, lng: number } | null>(null);
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: MAP_API_KEY || '',
        libraries,
    });
    const [selectedTab, setSelectedTab] = useState<string>('Public');
    const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
    const [mapCenter, setMapCenter] = useState<{ lat: number, lng: number }>(defaultCenter);
    const user = useUser();

    const handleTabChange = (tab: string) => {
        setSelectedTab(tab);
    };

    useEffect(() => {
        if(selectedTab === "Private"){
            console.log(user.user?.id);
            const filtered = events.filter(event => event.type === selectedTab && event.organizerId === user.user?.id);
            setFilteredEvents(filtered);
        } else {
            const filtered = events.filter(event => event.type === selectedTab);
            setFilteredEvents(filtered);
        }
    }, [selectedTab, events, user?.user?.id]);

    useEffect(() => {
        if (!isLoaded || !window.google) return;
        const markers: google.maps.marker.AdvancedMarkerElement[] = [];

        if (selectedLatLng) {
            const pin = new window.google.maps.marker.PinElement({
                scale: 1,
            });
            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current,
                position: selectedLatLng,
                content: pin.element,
                collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL
            });
            markers.push(marker);
        } else if (currentLocation) {
            const pin = new window.google.maps.marker.PinElement({
                scale: 1,
            });

            const marker = new window.google.maps.marker.AdvancedMarkerElement({
                map: mapRef.current,
                position: currentLocation,
                content: pin.element,
                collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL
            });
            markers.push(marker);
        }

        filteredEvents.forEach((event) => {
            if (event.latitude && event.longitude) {
                const glyphImg = document.createElement('img');
                glyphImg.src = `https://uninav.s3.us-east-1.amazonaws.com/markerIcons/${event.categoryId}.png`;
                glyphImg.style.width = '30px';
                glyphImg.style.borderRadius = '50px';

                const glyphSvgPinElement = new google.maps.marker.PinElement({
                    glyph: glyphImg,
                    scale: 1.5
                });

                const marker = new window.google.maps.marker.AdvancedMarkerElement({
                    map: mapRef.current,
                    position: { lat: event.latitude, lng: event.longitude },
                    content: glyphSvgPinElement.element,
                    collisionBehavior: google.maps.CollisionBehavior.REQUIRED_AND_HIDES_OPTIONAL,
                });

                marker.addListener("click", () => {
                    setCurrentEvent(event);
                    setEventPosition({ lat: event.latitude, lng: event.longitude });
                    setShowEventCard(true);
                })

                markers.push(marker);
            }
        });


        return () => {
            markers.forEach((marker) => (marker.map = null));
        };
    }, [isLoaded, filteredEvents, currentLocation, selectedLatLng]);

    if (loadError) {
        return <div>Error loading Google Maps. Please try again later.</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newCenter = { lat: latitude, lng: longitude };
                    setCurrentLocation(newCenter);
                    setMapCenter(newCenter);
                    if (mapRef.current) {
                        mapRef.current.panTo(newCenter);
                        mapRef.current.setZoom(15);
                    }
                    fetchWeatherData(newCenter).then();
                },
                (error) => {
                    console.error('Error getting current location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    const fetchWeatherData = async ({ lat, lng }: { lat: number, lng: number }) => {
        setIsLoadingWeather(true);
        setWeatherError(null);
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${WEATHER_API_KEY}`
            );
            if (!response.ok) throw new Error('Weather data not available');
            const data = await response.json();
            setWeatherData(data);
            setIsWeatherPopupVisible(true);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeatherError('Failed to fetch weather data. Please try again.');
        } finally {
            setIsLoadingWeather(false);
        }
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        const lat = e.latLng?.lat();
        const lng = e.latLng?.lng();

        if (lat !== undefined && lng !== undefined) {
            const clickedCoords = { lat, lng };
            setSelectedLatLng(clickedCoords);
            fetchWeatherData(clickedCoords);
        }
    };

    const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
        if (place.geometry?.location) {
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            setMapCenter({ lat, lng });
            setSelectedLatLng({ lat, lng });
            fetchWeatherData({ lat, lng });
            if (mapRef.current) {
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(15);
            }
        }
    };

    const handleEventSelect = (event: { id: string, name: string, latitude: number, longitude: number }) => {
        const selectedEvent = events.find(e => e.id === event.id);
        if (selectedEvent && selectedEvent.latitude && selectedEvent.longitude) {
            const lat = selectedEvent.latitude;
            const lng = selectedEvent.longitude;
            setMapCenter({ lat, lng });
            setSelectedLatLng({ lat, lng });
            if (mapRef.current) {
                mapRef.current.panTo({ lat, lng });
                mapRef.current.setZoom(25);
            }
        }
    };

    const handleCloseWeatherPopup = () => {
        setIsWeatherPopupVisible(false);
        setWeatherData(null);
    };

    const containerStyle = {
        width: '100%',
        height: '100vh',
    };

    const mapOptions = {
        mapId: "DEMO_MAP_ID"
    };

    return (
        <div className="map-wrapper">
            <div className="map-container">
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={10}
                    onLoad={(map) => {
                        mapRef.current = map;
                    }}
                    onClick={handleMapClick}
                    options={mapOptions}
                >
                    <div className="current-location" style={{ margin: '0 10px 10px 0' }}>
                        <CurrentLocationButton onClick={handleCurrentLocation} />
                    </div>

                    <div className="tabs-container"><Tabs onTabChange={handleTabChange} /></div>
                    <div className="post-button-container"><PostButton /></div>

                    {showEventCard && currentEvent && eventPosition && (
                        <InfoWindow
                            position={eventPosition}
                            onCloseClick={() => {
                                setShowEventCard(false);
                                setCurrentEvent(undefined);
                                setEventPosition(null);
                            }}
                            options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                        >
                            <EventCard
                                id={currentEvent.id}
                                name={currentEvent.name}
                                imageUrl={currentEvent.imageUrl || ""}
                                description={currentEvent.description || ""}
                                organizerId={currentEvent.organizerId}
                                onDelete={() => { }}
                            />
                        </InfoWindow>
                    )}

                    <div style={{
                        position: 'absolute',
                        top: '7px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 1
                    }}>
                        <SearchBar
                            map={mapRef.current}
                            events={filteredEvents}
                            onPlaceSelect={handlePlaceSelect}
                            onEventSelect={handleEventSelect}
                        />
                    </div>

                    {isWeatherPopupVisible && (
                        <WeatherCard
                            isWeatherPopupVisible={isWeatherPopupVisible}
                            isLoadingWeather={isLoadingWeather}
                            weatherError={weatherError}
                            weatherData={weatherData}
                            closeWeatherPopup={handleCloseWeatherPopup}
                        />
                    )}
                </GoogleMap>
            </div>
        </div>
    );
};

export default MapComponent;
