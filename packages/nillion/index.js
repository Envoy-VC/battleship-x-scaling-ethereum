const compute = async () => {
	const res = await fetch('http://localhost:8000/compute', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			carrier: [134, 135, 136, 137, 138],
			cruiser: [145, 155, 165],
			destroyer: [188, 189],
			battleship: [112, 122, 132, 142],
			submarine: [156, 157, 158],
			position: 132,
		}),
	});

	const data = await res.json();
	console.log(data);
};

const store_secrets = async () => {
	const res = await fetch('http://localhost:8000/store-secrets', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			carrier: [134, 135, 136, 137, 138],
			cruiser: [145, 155, 165],
			destroyer: [188, 189],
			battleship: [112, 122, 132, 142],
			submarine: [156, 157, 158],
		}),
	});

	const data = await res.json();
	console.log(data);
};

const retrieve_secrets = async () => {
	const res = await fetch('http://localhost:8000/retrieve-secrets', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			type: 'SecretArray',
			store_id: 'bf1ff690-5232-4df3-924d-7b6aae829a1d',
			secret_name: 'battleship',
		}),
	});

	const data = await res.json();
	console.log(data);
};

const get_board = async () => {
	const res = await fetch('http://localhost:8000/get-board', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			store_id: 'bf1ff690-5232-4df3-924d-7b6aae829a1d',
		}),
	});

	const data = await res.json();
	console.log(data);
};

get_board();
