import { apiURL } from '../request_sender.js';

const leaderboardList = document.getElementById('leaderboard-list');
const input = document.querySelector('.filter-name');
const userLogged = localStorage.getItem('userLogged');

function updateUIForLogout() {
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

input.addEventListener('keyup', () => {
	const filter = input.value.trim().toLowerCase();
	const listOfUsers = JSON.parse(localStorage.getItem('leaderboard')) || [];
	const filteredUsers = listOfUsers.filter((user) => {
		return user.name.toLowerCase().includes(filter);
	});

	leaderboardList.innerHTML = '';

	filteredUsers.map((user) => {
		const li = document.createElement('li');
		li.classList.add('list-group-item');
		li.textContent = `${user.name} - Level ${user.score}`;
		leaderboardList.appendChild(li);
	});
});

document.addEventListener('DOMContentLoaded', function () {
	loadLeaderBoard();
});

function loadLeaderBoard() {
	var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
	leaderboardList.innerHTML = '';

	leaderboard.forEach(function (entry) {
		var listItem = document.createElement('li');
		listItem.className = 'list-group-item';
		listItem.textContent = `${entry.name} - Level ${entry.score}`;
		leaderboardList.appendChild(listItem);
	});
}

const fetchUsers = async () => {
	try {
		const response = await fetch(`${apiURL}/players`, {
			method: 'GET',
		});
		if (!response.ok) {
			throw new Error('Failed to fetch users');
		}
		const users = await response.json();
		const list = users.map((user) => ({
			name: user.Login,
			score: user.Score || 0,
		}));
		localStorage.setItem('leaderboard', JSON.stringify(list));
		loadLeaderBoard();
	} catch (error) {
		console.log(error);
	}
};

fetchUsers();
