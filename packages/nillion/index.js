const main = async () => {
	const res = await fetch('http://localhost:8000/compute', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			row: [10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
			position: 23,
		}),
	});

	const data = await res.json();
	console.log(data);
};

main();
