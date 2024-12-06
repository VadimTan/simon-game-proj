import { apiURL } from '../request_sender.js';

const LOGIN_EXPIRATION_MS = 1 * 60 * 1000;
const userLogged = localStorage.getItem('userLogged');

function setUserLogged() {
	const timestamp = Date.now();
	localStorage.setItem(
		'userLoggedTime',
		JSON.stringify({ value: true, timestamp })
	);
}

function clearExpiredLogin() {
	const userLoggedTime = JSON.parse(localStorage.getItem('userLoggedTime'));
	if (userLoggedTime && userLoggedTime.value && userLoggedTime.timestamp) {
		const currentTime = Date.now();
		if (currentTime - userLoggedTime.timestamp > LOGIN_EXPIRATION_MS) {
			localStorage.removeItem('userLogged');
			localStorage.removeItem('userLoggedTime');
			localStorage.removeItem('username');
			updateUIForLogout();
		}
	}
	isUserLogged();
}

function navigateTo(route) {
	if (userLogged) {
		window.location.href = route;
	} else {
		if (window.location.pathname !== '/authorization.html') {
			window.location.href = '/authorization.html';
		}
	}
}

function updateUIForLogout() {
	navigateTo('/authorization.html');
	document.querySelector('.game-link').classList.add('d-none');
	document.querySelector('.leaderboard-link').classList.add('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
	isUserLogged();
});

function isUserLogged() {
	if (userLogged) {
		document.querySelector('.game-link').classList.remove('d-none');
		document.querySelector('.leaderboard-link').classList.remove('d-none');
	} else {
		updateUIForLogout();
	}
}

function showModal() {
	document.getElementById('loginModal').style.display = 'block';
}

document.querySelector('.close').addEventListener('click', () => {
	closeModal();
});

function closeModal() {
	document.getElementById('loginModal').style.display = 'none';
}

window.onclick = function (e) {
	if (e.target == document.getElementById('loginModal')) {
		closeModal();
	}
};

async function hashPassword(password) {
	const encoder = new TextEncoder();
	const data = encoder.encode(password);
	const hashBuffer = await crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	const hashHex = hashArray
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
	return hashHex;
}

document.querySelector('.register-btn').addEventListener('click', async () => {
	let username = document.querySelector('.username').value;
	let pass = document.querySelector('.password').value;

	const hashedPass = await hashPassword(pass);

	try {
		const response = await fetch(`${apiURL}/players`, {
			method: 'POST',
			body: JSON.stringify({ login: username, password: hashedPass }),
		});
		const userRegistered = response.ok;
		const errorMessage = await response.json().then((res) => res.error);
		if (userRegistered) {
			document.querySelector('.modal-text').innerHTML = `
			<h2>Success!</h2>
			<p>You have successfully registered</p>
			`;
			showModal();
		} else {
			document.querySelector('.modal-text').innerHTML = `
			<h2 style="color:red;">Try again!</h2>
			<p>${errorMessage}</p>
			`;
			showModal();
		}
	} catch (error) {
		console.error(error);
	}
});

document.querySelector('.authorize-btn').addEventListener('click', async () => {
	let username = document.querySelector('.username').value;
	let pass = document.querySelector('.password').value;

	const hashedPass = await hashPassword(pass);
	try {
		const response = await fetch(`${apiURL}/login`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ login: username, password: hashedPass }),
		});
		const userLogged = response.ok;
		const errorMessage = await response.json().then((res) => res.error);

		if (userLogged) {
			localStorage.setItem('username', username);
			localStorage.setItem('userLogged', true);
			setUserLogged();
			document.querySelector('.game-link').classList.remove('d-none');
			document.querySelector('.leaderboard-link').classList.remove('d-none');
			document.querySelector('.modal-text').innerHTML = `
			<h2>Success!</h2>
			<p>You have successfully logged in.</p>
			`;
			showModal();
		} else {
			document.querySelector('.modal-text').innerHTML = `
			<h2 style="color:red;">Try again!</h2>
			<p>${errorMessage}</p>
			`;
			showModal();
		}
	} catch (error) {
		console.error(error);
	}
});

setInterval(clearExpiredLogin, 60 * 1000);
