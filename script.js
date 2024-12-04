import { apiURL } from './request_sender.js';

var btnColors = ['red', 'green', 'yellow', 'blue'];
var gamePattern = [];
var userClickedPattern = [];
var start = false;
var level = 0;
var clickEnabled = false;
var userName = '';

document.getElementById('submit-name').addEventListener('click', function () {
	var nameInput = document.getElementById('username-input').value;
	if (nameInput && !isNameTaken(nameInput)) {
		userName = nameInput;
		document.getElementById('user-name').innerText = 'Player: ' + userName;
		document.getElementById('nameModal').style.display = 'none';
		document.getElementById('play-button').classList.remove('d-none');
	} else {
		document.getElementById('error-message').innerText =
			'This name is already taken. Try another!';
	}
});

document.addEventListener('DOMContentLoaded', function () {
	document.getElementById('nameModal').style.display = 'block';
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

function isNameTaken(name) {
	var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
	return leaderboard.some(function (entry) {
		return entry.name === name;
	});
}

document.getElementById('play-button').addEventListener('click', function () {
	startGame();
});

function startGame() {
	level = 0;
	gamePattern = [];
	userClickedPattern = [];
	start = false;
	clickEnabled = false;

	document.getElementById('level-title').innerText = 'Level ' + level;
	document.getElementById('play-button').classList.add('d-none');
	document.getElementById('game-buttons').classList.remove('d-none');
	document.getElementById('toggle-leaderboard').classList.remove('d-none');

	nextSequence();
}

var simonButtons = document.querySelectorAll('.simon-btn');
simonButtons.forEach(function (button) {
	button.addEventListener('click', function () {
		if (!clickEnabled) return;

		var userChosenColor = this.id;
		userClickedPattern.push(userChosenColor);
		turnSoundOn(userChosenColor);
		animatePress(userChosenColor);
		checkAnswer(userClickedPattern.length - 1);
	});
});

function checkAnswer(currentLevel) {
	if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
		if (userClickedPattern.length === gamePattern.length) {
			setTimeout(function () {
				nextSequence();
			}, 1000);
		}
	} else {
		turnSoundOn('wrong');
		document.body.classList.add('game-over');
		document.getElementById('level-title').innerText =
			'Game is over, ' + userName + ". Press 'Play' to try again";

		setTimeout(function () {
			document.body.classList.remove('game-over');
		}, 200);

		saveToLeaderBoard(userName, level);

		document.getElementById('play-button').classList.remove('d-none');
	}
}

function nextSequence() {
	userClickedPattern = [];
	level++;
	document.getElementById('level-title').innerText = 'Level ' + level;
	var randomNumber = Math.floor(Math.random() * 4);
	var randomChosenColor = btnColors[randomNumber];
	gamePattern.push(randomChosenColor);

	showSequence();
}

function showSequence() {
	clickEnabled = false;
	var i = 0;
	var intervalId = setInterval(function () {
		var currentColor = gamePattern[i];
		var button = document.getElementById(currentColor);
		button.classList.add('fade-in');
		turnSoundOn(currentColor);
		setTimeout(function () {
			button.classList.remove('fade-in');
		}, 150);

		i++;
		if (i >= gamePattern.length) {
			clearInterval(intervalId);
			clickEnabled = true;
		}
	}, 600);
}

function turnSoundOn(color) {
	var audio;
	if (color === 'wrong') {
		audio = new Audio('sounds/error-sound-effect.mp3');
	} else {
		audio = new Audio('sounds/game-sound-effect.mp3');
	}
	audio.play().catch(function (error) {
		console.error('Error to listen audio:', error);
	});
}

function animatePress(currentColor) {
	var button = document.getElementById(currentColor);
	button.classList.add('pressed');
	setTimeout(function () {
		button.classList.remove('pressed');
	}, 100);
}

function saveToLeaderBoard(name, score) {
	var leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
	var existingPlayer = leaderboard.find(function (entry) {
		return entry.name === name;
	});

	if (existingPlayer) {
		if (score > existingPlayer.score) {
			existingPlayer.score = score;
		}
	} else {
		leaderboard.push({ name: name, score: score });
	}

	leaderboard.sort(function (a, b) {
		return b.score - a.score;
	});
	localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
	loadLeaderBoard();
}

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
		const request = await fetch(`${apiURL}/players`, {
			method: 'POST',
			body: JSON.stringify({ login: username, password: hashedPass }),
		});
		console.log(request);
	} catch (error) {
		console.error(error);
	}
});

document.querySelector('.authorize-btn').addEventListener('click', async () => {
	let username = document.querySelector('.username').value;
	let pass = document.querySelector('.password').value;

	const hashedPass = await hashPassword(pass);
	try {
		const request = await fetch(`${apiURL}/login`, {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ login: username, password: hashedPass }),
		});
		console.log(request);
	} catch (error) {
		console.error(error);
	}
});

document.querySelector('.score-send').addEventListener('click', async () => {
	let score = document.querySelector('.score-number').value;
	let number = Number(score);
	try {
		const request = await fetch(`${apiURL}/players/vtanasiev1`, {
			method: 'PUT',
			credentials: 'include',
			body: JSON.stringify({ score: number }),
		});
		console.log(request);
	} catch (error) {
		console.error(error);
	}
});
