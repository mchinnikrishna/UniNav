import React from 'react';
import '../../Assets/css/WeatherCard.css';

interface WeatherCardProps {
    isWeatherPopupVisible: boolean;
    isLoadingWeather: boolean;
    weatherError: string | null;
    weatherData: any;
    closeWeatherPopup: () => void;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
                                                     isWeatherPopupVisible,
                                                     isLoadingWeather,
                                                     weatherError,
                                                     weatherData,
                                                     closeWeatherPopup,
                                                 }) => {
    if (!isWeatherPopupVisible) return null;

    return (
        <div className="weather-popup">
            <button className="close-button" onClick={closeWeatherPopup}>
                <i className="fas fa-times"></i>
            </button>
            {isLoadingWeather ? (
                <p className="loading-text">Loading weather data...</p>
            ) : weatherError ? (
                <p className="error">{weatherError}</p>
            ) : weatherData ? (
                <div className="weather-card">
                    <div className="temperature">{weatherData.main.temp.toFixed(1)}°C</div>
                    <div className="weather">
                        <div
                            className="weather-icon"
                            style={{
                                backgroundImage: `url(http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png)`,
                            }}
                        >
                            <div className="weather-description">
                                {weatherData.weather[0].description}
                            </div>
                        </div>

                    </div>
                    <div className="bottom-info">
                        <div className="location">
                            <i className="fas fa-map-marker-alt"></i> {weatherData.name}
                        </div>
                    </div>
                    <div className="details-grid">
                        <div className="details-item">Real Feel: {weatherData.main.feels_like.toFixed(1)}°C</div>
                        <div className="details-item">Pressure: {weatherData.main.pressure} hPa</div>
                        <div className="details-item">Wind Speed: {weatherData.wind.speed} m/s</div>
                        <div className="details-item">Humidity: {weatherData.main.humidity}%</div>
                    </div>
                </div>
            ) : (
                <p>No weather data available</p>
            )}
        </div>
    );
};

export default WeatherCard;