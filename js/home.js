var userLogged = localStorage.getItem('userLogged');

document.addEventListener('DOMContentLoaded', () => {
	isUserLogged();
});

function isUserLogged() {
	if (userLogged) {
		document.querySelector('.game-link').classList.remove('d-none');
		document.querySelector('.leaderboard-link').classList.remove('d-none');
	}
}
