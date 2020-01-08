let main = document.querySelector('.main');
let locationDisplay = document.getElementById('location-display');
let locationInput = document.getElementById('location');
let searchButton = document.getElementById('search');
let initialEls = document.querySelectorAll('.initial');

searchButton.addEventListener('click', (e) => {
	e.preventDefault();

	main.classList.add('snow');
	for (let el of initialEls) {
		el.classList.add('fade-out');
	}

	let location = locationInput.value;
	searchButton.innerText = 'New Search';
	locationDisplay.innerHTML = `<p class="fade-in">${location}</p>`;
});
