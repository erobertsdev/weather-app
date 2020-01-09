let main = document.querySelector('.main');
let locationDisplay = document.getElementById('location-display');
let locationInput = document.getElementById('location');
let searchButton = document.getElementById('search');
let initialEls = document.querySelectorAll('.initial');

const search = async (location) => {
	const response = await axios.get('http://api.openweathermap.org/data/2.5/weather/', {
		params: {
			appid: '2d67bc089943044e986c0d091fc1f083',
			q: location
		}
	});
	return response.data;
};

searchButton.addEventListener('click', async (e) => {
	e.preventDefault();
	let location = locationInput.value;
	const data = await search(location);
	location = data.name;
	const tempF = Math.ceil((data.main.temp - 273.15) * (9 / 5) + 32);
	const tempC = Math.ceil(data.main.temp - 273.15);
	const highF = Math.ceil((data.main.temp_max - 273.15) * (9 / 5) + 32);
	const lowF = Math.ceil((data.main.temp_min - 273.15) * (9 / 5) + 32);
	const highC = Math.ceil(data.main.temp_max - 273.15);
	const lowC = Math.ceil(data.main.temp_min - 273.15);
	const humidity = data.main.humidity;
	const windSpeedMph = Math.floor(data.wind.speed);
	const windSpeedKph = Math.ceil(data.wind.speed * 1.609);
	const description = `${data.weather[0].main}, ${data.weather[0].description}`;

	if (description.includes('clouds')) {
		main.classList.add('cloudy');
	}
	if (description.includes('rain')) {
		main.classList.add('rain');
	}
	if (description.includes('snow')) {
		main.classList.add('snow');
	}

	for (let el of initialEls) {
		el.classList.add('fade-out');
	}

	searchButton.innerText = 'New Search';
	locationDisplay.innerHTML = `
	<p class="fade-in location-name">${location}</p>
	<p class="fade-in">Temperature: ${tempF}&deg; F | ${tempC}&deg; C</p>
	<p class="fade-in">High: ${highF}&deg; F | ${highC}&deg; C</p>
	<p class="fade-in">Low: ${lowF}&deg; F | ${lowC}&deg; C</p>
	<p class="fade-in">Wind: ${windSpeedMph} mph | ${windSpeedKph} kph</p>
	<p class="fade-in">Humidity: ${humidity}&percnt;</p>
	<p class="fade-in">Conditions: ${description}</p>
	`;
	locationDisplay.classList.remove('hide');
});
