// Realistic weather profiles for various conditions
export const mockCities = {
  "london": {
    name: "London",
    country: "United Kingdom",
    lat: 51.52,
    lon: -0.11,
    conditionType: "cloudy",
    current: {
      temp_c: 16,
      feelslike_c: 15,
      condition: { text: "Mostly Cloudy", code: 1003 },
      humidity: 78,
      wind_kph: 14,
      wind_dir: "WSW",
      pressure_mb: 1012,
      vis_km: 10,
      uv: 3,
      sunrise: "04:43 AM",
      sunset: "09:21 PM"
    }
  },
  "new york": {
    name: "New York",
    country: "United States",
    lat: 40.71,
    lon: -74.01,
    conditionType: "sunny",
    current: {
      temp_c: 26,
      feelslike_c: 27,
      condition: { text: "Sunny", code: 1000 },
      humidity: 52,
      wind_kph: 11,
      wind_dir: "NE",
      pressure_mb: 1018,
      vis_km: 16,
      uv: 8,
      sunrise: "05:24 AM",
      sunset: "08:30 PM"
    }
  },
  "tokyo": {
    name: "Tokyo",
    country: "Japan",
    lat: 35.69,
    lon: 139.69,
    conditionType: "sunny",
    current: {
      temp_c: 28,
      feelslike_c: 30,
      condition: { text: "Clear", code: 1000 },
      humidity: 64,
      wind_kph: 8,
      wind_dir: "SSE",
      pressure_mb: 1014,
      vis_km: 12,
      uv: 7,
      sunrise: "04:25 AM",
      sunset: "07:00 PM"
    }
  },
  "sydney": {
    name: "Sydney",
    country: "Australia",
    lat: -33.87,
    lon: 151.21,
    conditionType: "rainy",
    current: {
      temp_c: 15,
      feelslike_c: 14,
      condition: { text: "Light Rain", code: 1063 },
      humidity: 88,
      wind_kph: 24,
      wind_dir: "S",
      pressure_mb: 1008,
      vis_km: 8,
      uv: 2,
      sunrise: "06:59 AM",
      sunset: "04:54 PM"
    }
  },
  "paris": {
    name: "Paris",
    country: "France",
    lat: 48.87,
    lon: 2.33,
    conditionType: "sunny",
    current: {
      temp_c: 22,
      feelslike_c: 22,
      condition: { text: "Partly Cloudy", code: 1003 },
      humidity: 58,
      wind_kph: 12,
      wind_dir: "NW",
      pressure_mb: 1015,
      vis_km: 14,
      uv: 5,
      sunrise: "05:47 AM",
      sunset: "09:57 PM"
    }
  },
  "reykjavik": {
    name: "Reykjavik",
    country: "Iceland",
    lat: 64.15,
    lon: -21.95,
    conditionType: "snowy",
    current: {
      temp_c: 1,
      feelslike_c: -4,
      condition: { text: "Light Snow", code: 1213 },
      humidity: 82,
      wind_kph: 32,
      wind_dir: "N",
      pressure_mb: 998,
      vis_km: 6,
      uv: 1,
      sunrise: "02:55 AM",
      sunset: "11:58 PM"
    }
  },
  "mumbai": {
    name: "Mumbai",
    country: "India",
    lat: 19.07,
    lon: 72.87,
    conditionType: "stormy",
    current: {
      temp_c: 30,
      feelslike_c: 37,
      condition: { text: "Thunderstorm", code: 1087 },
      humidity: 85,
      wind_kph: 28,
      wind_dir: "WSW",
      pressure_mb: 1005,
      vis_km: 7,
      uv: 9,
      sunrise: "06:01 AM",
      sunset: "07:15 PM"
    }
  },
  "cairo": {
    name: "Cairo",
    country: "Egypt",
    lat: 30.06,
    lon: 31.25,
    conditionType: "sunny",
    current: {
      temp_c: 36,
      feelslike_c: 38,
      condition: { text: "Hot and Sunny", code: 1000 },
      humidity: 30,
      wind_kph: 16,
      wind_dir: "NE",
      pressure_mb: 1010,
      vis_km: 16,
      uv: 11,
      sunrise: "04:53 AM",
      sunset: "06:59 PM"
    }
  },
  "singapore": {
    name: "Singapore",
    country: "Singapore",
    lat: 1.29,
    lon: 103.85,
    conditionType: "rainy",
    current: {
      temp_c: 28,
      feelslike_c: 34,
      condition: { text: "Heavy Showers", code: 1243 },
      humidity: 82,
      wind_kph: 10,
      wind_dir: "E",
      pressure_mb: 1009,
      vis_km: 10,
      uv: 10,
      sunrise: "06:59 AM",
      sunset: "07:08 PM"
    }
  }
};

// Seeded simple pseudo-random generator based on a string seed (city name)
function createSeededRandom(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return function() {
    const x = Math.sin(hash++) * 10000;
    return x - Math.floor(x);
  };
}

export function generateMockWeather(query) {
  const cleanQuery = query.toLowerCase().trim();
  
  // Try exact match
  if (mockCities[cleanQuery]) {
    return createFullMockProfile(mockCities[cleanQuery]);
  }
  
  // Try partial match
  const matchedKey = Object.keys(mockCities).find(key => key.includes(cleanQuery) || cleanQuery.includes(key));
  if (matchedKey) {
    return createFullMockProfile(mockCities[matchedKey]);
  }
  
  // If no match, generate dynamically
  const random = createSeededRandom(cleanQuery);
  const conditions = ["sunny", "cloudy", "rainy", "snowy", "stormy"];
  const conditionType = conditions[Math.floor(random() * conditions.length)];
  
  let temp_c = 15 + Math.floor(random() * 20); // 15 to 35
  let conditionText = "Partly Cloudy";
  let conditionCode = 1003;
  
  if (conditionType === "sunny") {
    temp_c = 22 + Math.floor(random() * 15); // 22 to 37
    conditionText = temp_c > 32 ? "Hot and Sunny" : "Clear";
    conditionCode = 1000;
  } else if (conditionType === "rainy") {
    temp_c = 10 + Math.floor(random() * 12); // 10 to 22
    conditionText = random() > 0.5 ? "Light Rain Showers" : "Heavy Rain";
    conditionCode = 1189;
  } else if (conditionType === "snowy") {
    temp_c = -5 + Math.floor(random() * 8); // -5 to 3
    conditionText = "Moderate Snow";
    conditionCode = 1219;
  } else if (conditionType === "stormy") {
    temp_c = 18 + Math.floor(random() * 10); // 18 to 28
    conditionText = "Thunderstorms";
    conditionCode = 1276;
  }
  
  const formattedName = query.charAt(0).toUpperCase() + query.slice(1);
  const mockCity = {
    name: formattedName,
    country: random() > 0.5 ? "Local Region" : "International",
    lat: (random() * 180 - 90).toFixed(2),
    lon: (random() * 360 - 180).toFixed(2),
    conditionType,
    current: {
      temp_c,
      feelslike_c: Math.round(temp_c + (random() * 4 - 2)),
      condition: { text: conditionText, code: conditionCode },
      humidity: 40 + Math.floor(random() * 50),
      wind_kph: 5 + Math.floor(random() * 25),
      wind_dir: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(random() * 8)],
      pressure_mb: 1005 + Math.floor(random() * 15),
      vis_km: 5 + Math.floor(random() * 11),
      uv: 1 + Math.floor(random() * 10),
      sunrise: "06:12 AM",
      sunset: "07:45 PM"
    }
  };
  
  return createFullMockProfile(mockCity);
}

function createFullMockProfile(cityBase) {
  const random = createSeededRandom(cityBase.name);
  
  // Generate 24 Hourly Items
  const hourly = [];
  const startTemp = cityBase.current.temp_c - 5;
  for (let i = 0; i < 24; i++) {
    // Diurnal temperature variation curve (coldest at 4am, warmest at 4pm)
    const factor = Math.sin(((i - 10) / 24) * Math.PI * 2); // Ranges -1 to +1
    const hourTemp = Math.round(cityBase.current.temp_c + factor * 6);
    
    let hourText = cityBase.current.condition.text;
    let hourCode = cityBase.current.condition.code;
    
    // Slight condition variation during night
    const isNight = i < 6 || i > 20;
    if (isNight && cityBase.conditionType === "sunny") {
      hourText = "Clear";
      hourCode = 1000;
    } else if (isNight && cityBase.conditionType === "cloudy") {
      hourText = "Partly Cloudy";
      hourCode = 1003;
    }
    
    hourly.push({
      time: `${i.toString().padStart(2, '0')}:00`,
      temp_c: hourTemp,
      feelslike_c: Math.round(hourTemp + (random() * 2 - 1)),
      condition: { text: hourText, code: hourCode },
      humidity: Math.min(100, Math.max(20, cityBase.current.humidity + Math.round(factor * -10))),
      wind_kph: Math.max(2, Math.round(cityBase.current.wind_kph + (random() * 8 - 4))),
      pop: cityBase.conditionType === "rainy" ? 80 : cityBase.conditionType === "stormy" ? 90 : cityBase.conditionType === "snowy" ? 70 : 10
    });
  }
  
  // Generate 7 Days Forecast
  const daily = [];
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const today = new Date();
  
  for (let i = 0; i < 7; i++) {
    const forecastDate = new Date(today);
    forecastDate.setDate(today.getDate() + i);
    const dayName = i === 0 ? "Today" : daysOfWeek[forecastDate.getDay()];
    
    const daySeed = random();
    let dayConditionType = cityBase.conditionType;
    let dayText = cityBase.current.condition.text;
    let dayCode = cityBase.current.condition.code;
    
    // Vary conditions a bit for upcoming days
    if (i > 0) {
      if (daySeed < 0.25) {
        dayConditionType = "sunny";
        dayText = "Sunny";
        dayCode = 1000;
      } else if (daySeed < 0.5) {
        dayConditionType = "cloudy";
        dayText = "Partly Cloudy";
        dayCode = 1003;
      } else if (daySeed < 0.75) {
        dayConditionType = "rainy";
        dayText = "Showers";
        dayCode = 1189;
      }
    }
    
    const maxTemp = cityBase.current.temp_c + Math.round(daySeed * 6 - 2);
    const minTemp = maxTemp - Math.round(5 + daySeed * 4);
    
    daily.push({
      day: dayName,
      date: forecastDate.toISOString().split('T')[0],
      maxTemp,
      minTemp,
      conditionType: dayConditionType,
      condition: { text: dayText, code: dayCode },
      uv: Math.max(1, cityBase.current.uv + Math.round(daySeed * 4 - 2)),
      humidity: Math.min(100, Math.max(20, cityBase.current.humidity + Math.round(daySeed * 20 - 10))),
      wind_kph: Math.max(5, cityBase.current.wind_kph + Math.round(daySeed * 10 - 5))
    });
  }
  
  return {
    location: {
      name: cityBase.name,
      country: cityBase.country,
      lat: cityBase.lat,
      lon: cityBase.lon,
      localtime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    },
    current: {
      ...cityBase.current,
      conditionType: cityBase.conditionType
    },
    forecast: {
      hourly,
      daily
    },
    isMock: true
  };
}

// Support search suggestions based on our predefined cities list
export function getMockSuggestions(query) {
  const cleanQuery = query.toLowerCase().trim();
  if (!cleanQuery) return [];
  
  return Object.values(mockCities)
    .filter(city => 
      city.name.toLowerCase().includes(cleanQuery) || 
      city.country.toLowerCase().includes(cleanQuery)
    )
    .map(city => ({
      name: city.name,
      country: city.country,
      lat: city.lat,
      lon: city.lon
    }));
}
