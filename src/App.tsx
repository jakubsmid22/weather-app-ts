import axios from "axios";
import { useState } from "react";

type WeatherData = {
  clouds: { all: number };
  main: {
    feels_like: number;
    grnd_level: number;
    humidity: number;
    pressure: number;
    sea_level: number;
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
  sys: { country: string; sunrise: number; sunset: number };
  timezone: number;
  weather: { description: string; main: string };
  wind: { deg: number; speed: number };
};

const App = () => {
  const API_KEY = import.meta.env.VITE_API_KEY;
  const [city, setCity] = useState<string>("");
  const [data, setData] = useState<WeatherData | null>(null);

  const getData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!city) {
      alert("Please enter a city name");
      return;
    }

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${city}&appid=${API_KEY}`
      )
      .then((res) => {
        setData(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getTimeForZone = (timezone: number): string => {
    const date = new Date();
    const utc = date.getTime() + date.getTimezoneOffset() * 60000;
    const newDate = new Date(utc + timezone * 1000);

    const hours = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes}`;
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 p-6">
      <h1 className="text-5xl font-extrabold mb-10 text-blue-800 drop-shadow-lg">
        Weather App
      </h1>
      <form
        onSubmit={getData}
        className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md"
      >
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          placeholder="Enter city name"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Search
        </button>
      </form>
      {data && (
        <div className="bg-white p-6 mt-10 rounded-lg shadow-lg max-w-lg w-full text-center">
          <h2 className="text-3xl font-semibold mb-3 text-blue-700">
            {data.name}, {data.sys.country}
          </h2>
          <p className="text-xl font-medium text-gray-700">
            {data.weather.main}
          </p>
          <p className="text-gray-500 italic mb-4">
            {data.weather.description}
          </p>
          <div className="grid grid-cols-2 gap-4">
            <p className="font-semibold">
              Temp: <span className="font-normal">{data.main.temp}°C</span>
            </p>
            <p className="font-semibold">
              Feels like:{" "}
              <span className="font-normal">{data.main.feels_like}°C</span>
            </p>
            <p className="font-semibold">
              Humidity:{" "}
              <span className="font-normal">{data.main.humidity}%</span>
            </p>
            <p className="font-semibold">
              Pressure:{" "}
              <span className="font-normal">{data.main.pressure} hPa</span>
            </p>
            <p className="font-semibold">
              Wind: <span className="font-normal">{data.wind.speed} m/s</span>
            </p>
            <p className="font-semibold">
              Cloudiness:{" "}
              <span className="font-normal">{data.clouds.all}%</span>
            </p>
            <p className="font-semibold col-span-2">
              Time:{" "}
              <span className="font-normal">
                {getTimeForZone(data.timezone)}
              </span>
            </p>
            <p className="font-semibold col-span-2">
              Sunrise:{" "}
              <span className="font-normal">
                {new Date(data.sys.sunrise * 1000).toLocaleTimeString()}
              </span>
            </p>
            <p className="font-semibold col-span-2">
              Sunset:{" "}
              <span className="font-normal">
                {new Date(data.sys.sunset * 1000).toLocaleTimeString()}
              </span>
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
