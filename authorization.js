import { apiURL } from './request_sender.js';

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
