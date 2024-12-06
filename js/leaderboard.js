import { apiURL } from '../request_sender.js';

const leaderboardList = document.getElementById('leaderboard-list');

document.addEventListener('DOMContentLoaded', function () {
	loadLeaderBoard();

	document
		.getElementById('toggle-leaderboard')
		.addEventListener('click', function () {
			var leaderboard = document.querySelector('.leaderboard');
			if (
				leaderboard.style.display === 'none' ||
				leaderboard.style.display === ''
			) {
				leaderboard.style.display = 'block';
			} else {
				leaderboard.style.display = 'none';
			}
		});
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
