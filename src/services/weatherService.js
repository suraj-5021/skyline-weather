import { generateMockWeather, getMockSuggestions } from '../utils/mockData';

const BASE_URL = 'https://api.weatherapi.com/v1';
function getActiveApiKey() {
  try {
    const userKey = localStorage.getItem('skyline_user_api_key');
    if (userKey && userKey.trim() !== "") {
      return userKey.trim();
    }
  } catch (e) {
    console.warn("Could not read user API key from localStorage", e);
  }
  return import.meta.env.VITE_WEATHER_API_KEY;
}

// Map WeatherAPI codes to our internal theme types
export function getConditionType(code) {
  const c = Number(code);
  if (c === 1000) return 'sunny';
  // Clouds, mist, fog
  if ([1003, 1006, 1009, 1030, 1135, 1147].includes(c)) return 'cloudy';
  // Rain, drizzle
  if ([1063, 1150, 1153, 1180, 1183, 1186, 1189, 1192, 1195, 1240, 1243, 1246, 1198, 1201, 1249].includes(c)) return 'rainy';
  // Snow, ice, sleet
  if ([1066, 1069, 1072, 1114, 1117, 1204, 1207, 1210, 1213, 1216, 1219, 1222, 1225, 1237, 1252, 1255, 1258, 1261, 1264].includes(c)) return 'snowy';
  // Thunderstorm
  if ([1087, 1273, 1276, 1279, 1282].includes(c)) return 'stormy';
  
  return 'cloudy';
}

export async function fetchWeatherData(query) {
  const activeKey = getActiveApiKey();
  
  // If no API key is specified, run in Demo Mode instantly (silently)
  if (!activeKey || activeKey.trim() === "") {
    // Simulate API delay for a premium loading experience
    await new Promise(resolve => setTimeout(resolve, 800));
    return generateMockWeather(query);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${activeKey}&q=${encodeURIComponent(query)}&days=7&aqi=no&alerts=no`
    );

    if (!response.ok) {
      if (response.status === 400 || response.status === 401 || response.status === 403) {
        // Log key issue or bad request, but fall back gracefully
        console.warn("WeatherAPI returned error. Falling back to mock data.", response.statusText);
        return generateMockWeather(query);
      }
      throw new Error(`Weather API error: ${response.statusText}`);
    }

    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    console.error("Fetch weather failed. Falling back to mock data.", error);
    // Ultimate fallback to guarantee the site works
    return generateMockWeather(query);
  }
}

export async function fetchSuggestions(query) {
  if (!query || query.trim().length < 2) return [];

  const activeKey = getActiveApiKey();

  if (!activeKey || activeKey.trim() === "") {
    return getMockSuggestions(query);
  }

  try {
    const response = await fetch(
      `${BASE_URL}/search.json?key=${activeKey}&q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      return getMockSuggestions(query);
    }

    const data = await response.json();
    return data.map(item => ({
      name: item.name,
      country: item.country,
      lat: item.lat,
      lon: item.lon
    }));
  } catch (error) {
    console.error("Fetch suggestions failed. Using mock suggestions.", error);
    return getMockSuggestions(query);
  }
}

// Convert WeatherAPI response to our uniform frontend structure
function formatWeatherData(data) {
  const currentConditionCode = data.current.condition.code;
  const conditionType = getConditionType(currentConditionCode);
  
  // Format hourly forecast (for the next 24 hours starting from the current hour or simply today's hours)
  const currentHour = new Date().getHours();
  
  // Combine today's and tomorrow's hours to show the next 24 hours from now
  const todayHours = data.forecast.forecastday[0].hour;
  const tomorrowHours = data.forecast.forecastday[1]?.hour || [];
  
  const allHours = [...todayHours, ...tomorrowHours];
  
  // Find current hour index in today's hours
  const startIndex = currentHour;
  const next24Hours = allHours.slice(startIndex, startIndex + 24).map(h => {
    // Format hour display (e.g., "2026-06-15 09:00" -> "09:00")
    const timeString = h.time.split(" ")[1];
    
    return {
      time: timeString,
      temp_c: Math.round(h.temp_c),
      feelslike_c: Math.round(h.feelslike_c),
      condition: {
        text: h.condition.text,
        code: h.condition.code
      },
      humidity: h.humidity,
      wind_kph: Math.round(h.wind_kph),
      pop: h.chance_of_rain > 0 ? h.chance_of_rain : (h.chance_of_snow > 0 ? h.chance_of_snow : 0)
    };
  });

  // Format 7 daily items
  const dailyForecast = data.forecast.forecastday.map((day, idx) => {
    const dateObj = new Date(day.date + "T00:00:00");
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayName = idx === 0 ? "Today" : daysOfWeek[dateObj.getDay()];

    return {
      day: dayName,
      date: day.date,
      maxTemp: Math.round(day.day.maxtemp_c),
      minTemp: Math.round(day.day.mintemp_c),
      conditionType: getConditionType(day.day.condition.code),
      condition: {
        text: day.day.condition.text,
        code: day.day.condition.code
      },
      uv: day.day.uv,
      humidity: day.day.avghumidity,
      wind_kph: Math.round(day.day.maxwind_kph)
    };
  });

  return {
    location: {
      name: data.location.name,
      country: data.location.country,
      lat: data.location.lat,
      lon: data.location.lon,
      localtime: data.location.localtime.split(" ")[1] || ""
    },
    current: {
      temp_c: Math.round(data.current.temp_c),
      feelslike_c: Math.round(data.current.feelslike_c),
      condition: {
        text: data.current.condition.text,
        code: data.current.condition.code
      },
      humidity: data.current.humidity,
      wind_kph: Math.round(data.current.wind_kph),
      wind_dir: data.current.wind_dir,
      pressure_mb: data.current.pressure_mb,
      vis_km: data.current.vis_km,
      uv: data.current.uv,
      sunrise: data.forecast.forecastday[0].astro.sunrise,
      sunset: data.forecast.forecastday[0].astro.sunset,
      conditionType
    },
    forecast: {
      hourly: next24Hours,
      daily: dailyForecast
    },
    isMock: false
  };
}
