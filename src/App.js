import { useState } from 'react';
import { useWeather } from './useWeather';

function Day({ date, max_temp, min_temp, code }) {
  function getWeatherIcon(wmoCode) {
    const icons = new Map([
      [[0], '☀️'],
      [[1], '🌤'],
      [[2], '⛅️'],
      [[3], '☁️'],
      [[45, 48], '🌫'],
      [[51, 56, 61, 66, 80], '🌦'],
      [[53, 55, 63, 65, 57, 67, 81, 82], '🌧'],
      [[71, 73, 75, 77, 85, 86], '🌨'],
      [[95], '🌩'],
      [[96, 99], '⛈'],
    ]);
    const arr = [...icons.keys()].find((key) => key.includes(wmoCode));
    if (!arr) return 'NOT FOUND';
    return icons.get(arr);
  }

  function formatDay(dateStr) {
    return new Intl.DateTimeFormat('en', {
      weekday: 'short',
    }).format(new Date(dateStr));
  }

  return (
    <li className='day'>
      <span>{getWeatherIcon(code)}</span>
      <p>{formatDay(date)}</p>
      <p>
        {Math.floor(min_temp)}&deg; &mdash; {Math.ceil(max_temp)}&deg;
      </p>
    </li>
  );
}

function WeatherCard({ weatherData, location }) {
  const {
    temperature_2m_min: min_temps,
    temperature_2m_max: max_temps,
    time: dates,
    weathercode: codes,
  } = weatherData;

  return (
    <div>
      <h2>Weather {location}</h2>
      <ul className='weather'>
        {dates.map((date, i) => (
          <Day
            key={date}
            date={date}
            code={codes.at(i)}
            max_temp={max_temps.at(i)}
            min_temp={min_temps.at(i)}
          />
        ))}
      </ul>
    </div>
  );
}

function Loader() {
  return <p className='loader'>Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className='error'>
      <span>🛑</span> {message}
    </p>
  );
}

export default function App() {
  const [location, setLocation] = useState('');
  const { displayLocation, weatherData, isLoading, error, fetchWeather } =
    useWeather();

  function handleLocationChange(e) {
    setLocation(e.target.value);
  }

  function handleClick() {
    fetchWeather(location);
  }

  return (
    <div className='app'>
      <h1>Weather Planner</h1>
      <div>
        <input
          value={location}
          type='text'
          placeholder='Search from location'
          onChange={handleLocationChange}
        />
      </div>
      <button onClick={handleClick}>Get Weather</button>

      {error && <ErrorMessage message={error} />}
      {isLoading && <Loader />}
      {!error && !isLoading && weatherData?.weathercode && (
        <WeatherCard weatherData={weatherData} location={displayLocation} />
      )}
    </div>
  );
}
