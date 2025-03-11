const apiKey = '882039e5a3ba55c88fcacc6959d137aa';
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherInfo = document.getElementById('weatherInfo');
const suggestionsList = document.getElementById('suggestions');

// Function to fetch city suggestions
async function getCitySuggestions(query) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.list && data.list.length > 0) {
            return data.list.map(city => ({
                name: city.name,
                country: city.sys.country
            }));
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error fetching city suggestions:', error);
        return [];
    }
}

// Function to display city suggestions
function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = ''; // Clear previous suggestions

    suggestions.forEach(city => {
        const option = document.createElement('div');
        option.textContent = `${city.name}, ${city.country}`;
        option.classList.add('suggestion-item');
        option.addEventListener('click', () => {
            cityInput.value = `${city.name}, ${city.country}`;
            suggestionsList.innerHTML = ''; // Clear suggestions after selection
        });
        suggestionsList.appendChild(option);
    });
}

// Event listener for city input
cityInput.addEventListener('input', async () => {
    const query = cityInput.value.trim();

    if (query.length >= 2) { // Start showing suggestions after 2 characters
        const suggestions = await getCitySuggestions(query);
        displaySuggestions(suggestions);
    } else {
        suggestionsList.innerHTML = ''; // Clear suggestions if input is too short
    }
});

// Event listener for search button
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

// Event listener for Enter key
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = cityInput.value.trim();
        if (city) {
            getWeather(city);
        } else {
            alert('Please enter a city name.');
        }
    }
});

// Function to fetch weather data
async function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.cod === 200) {
            const { name, main, weather, sys } = data;
            const temperature = main.temp;
            const description = weather[0].description;
            const icon = weather[0].icon;
            const country = sys.country;

            weatherInfo.innerHTML = `
                <div class="weather-icon">
                    <img src="http://openweathermap.org/img/wn/${icon}@2x.png" alt="${description}">
                </div>
                <h2>${name}, ${country}</h2>
                <div class="weather-details">
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${description}</p>
                </div>
            `;
        } else {
            weatherInfo.innerHTML = `<p>City not found. Please try again.</p>`;
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
        weatherInfo.innerHTML = `<p>An error occurred. Please try again later.</p>`;
    }
}