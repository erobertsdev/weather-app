let searched, lat, lon;
let body = document.querySelector('body');
let main = document.querySelector('.main');

const initPage = () => {
	main.innerHTML = `
		<div>
            <form class="fade-in">
                <label for="location" class="initial main-title">How's the weather in: </label>
                <div id="location-display" class="hide"></div>
				<input type="text" id="location" class="initial" placeholder="City or Zipcode" required>
				<div class="check">
					<button id="search">Check Weather</button>
				</div>
			</form>
			<p id="current-location" class="initial location-text fade-in">Use My Location</p>
            <div class="github">
                <a href="https://github.com/erobertsdev/weather-app" target="_blank"><i class="fab fa-github-square fade-in"></i></a>
            </div>
		</div>
		`;
	searched = false;
};

initPage();

let locationDisplay = document.getElementById('location-display');
let currentLocation = document.getElementById('current-location');
let searchButton = document.getElementById('search');

searchButton.addEventListener('click', (e) => {
	e.preventDefault();
	if (!searched) {
		renderWeather();
	} else {
		window.location.reload();
	}
});

currentLocation.addEventListener('click', () => {
	navigator.geolocation.getCurrentPosition(async function success(pos) {
		let coords = pos.coords;
		lat = coords.latitude;
		lon = coords.longitude;
		if (!searched) {
			renderWeather();
		} else {
			window.location.reload();
		}
	});
});

const search = async (location, lat, lon) => {
	if (location !== '') {
		try {
			const response = await axios.get('https://api.openweathermap.org/data/2.5/weather/', {
				params: {
					appid: '2d67bc089943044e986c0d091fc1f083',
					q: location
				}
			});
			return response.data;
		} catch (error) {
			locationDisplay.innerHTML = `<p class="fade-in">No location found, try again.</p>`;
			locationDisplay.classList.remove('hide');
			return;
		}
	} else {
		try {
			const response = await axios.get('https://api.openweathermap.org/data/2.5/weather/', {
				params: {
					appid: '2d67bc089943044e986c0d091fc1f083',
					lat: lat,
					lon: lon
				}
			});
			return response.data;
		} catch (error) {
			locationDisplay.innerHTML = `<p class="fade-in">No location found, try again.</p>`;
			locationDisplay.classList.remove('hide');
			return;
		}
	}
};

const renderWeather = async () => {
	let locationInput = document.getElementById('location');
	let initialEls = document.querySelectorAll('.initial');
	let searchLocation = locationInput.value;

	const data = await search(searchLocation, lat, lon);
	searchLocation = data.name;
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

	if (description.includes('clear')) {
		body.classList.add('clear');
	}
	if (description.includes('clouds')) {
		body.classList.add('cloudy');
	}
	if (description.includes('thunderstorm')) {
		body.classList.add('storm');
	}
	if (description.includes('rain') || description.includes('drizzle')) {
		body.classList.add('rain');
	}
	if (description.includes('snow')) {
		body.classList.add('snow');
	}
	if (description.includes('mist') || description.includes('haze') || description.includes('fog')) {
		body.classList.add('mist');
	}

	for (let el of initialEls) {
		el.classList.add('fade-out');
	}

	searchButton.innerText = 'New Search';
	locationDisplay.innerHTML = `
				<p class="fade-in location-name">${searchLocation}</p>
				<p class="fade-in">Temperature: ${tempF}&deg; F | ${tempC}&deg; C</p>
				<p class="fade-in">High: ${highF}&deg; F | ${highC}&deg; C</p>
				<p class="fade-in">Low: ${lowF}&deg; F | ${lowC}&deg; C</p>
				<p class="fade-in">Wind: ${windSpeedMph} mph | ${windSpeedKph} kph</p>
				<p class="fade-in">Humidity: ${humidity}&percnt;</p>
				<p class="fade-in">Conditions: ${description}</p>
				`;
	locationDisplay.classList.remove('hide');
	searched = true;
};
