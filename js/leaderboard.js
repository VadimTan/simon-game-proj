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
	var leaderboardList = document.getElementById('leaderboard-list');
	leaderboardList.innerHTML = '';

	leaderboard.forEach(function (entry) {
		var listItem = document.createElement('li');
		listItem.className = 'list-group-item';
		listItem.textContent = entry.name + ' - Level ' + entry.score;
		leaderboardList.appendChild(listItem);
	});
}
