var btnColors = ['red', 'green', 'yellow', 'blue'];
var gamePattern = [];
var userClickedPattern = [];
var start = false;
var level = 0;
var clickEnabled = false;
var userName = localStorage.getItem('username');

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
}
