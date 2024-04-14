const storeBoard = async () => {
	const res = await fetch('http://localhost:8000/store-board', {
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
			user_key:
				'4r5ziYYPrcQisT4RrSbhWqgekHcVnNZTbKB2ZVeESm6jHsHjJVf5VgbsHvcAtiEqBfyPWgmkSUGrdh8iiEaCk1YZ',
		}),
	});

	const data = await res.json();
	console.log(JSON.stringify(data, null, 2));
};

const main = async () => {
	await storeBoard();
};

main();
