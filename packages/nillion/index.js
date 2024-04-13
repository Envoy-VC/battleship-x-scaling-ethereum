/**
 * program: main
inputs:
 secrets:
  carrier:
   Array:
    inner_type: SecretInteger
    values:
     - SecretInteger: '134'
     - SecretInteger: '135'
     - SecretInteger: '136'
     - SecretInteger: '137'
     - SecretInteger: '138'
  cruiser:
   Array:
    inner_type: SecretInteger
    values:
     - SecretInteger: '145'
     - SecretInteger: '155'
     - SecretInteger: '165'
  destroyer:
   Array:
    inner_type: SecretInteger
    values:
     - SecretInteger: '188'
     - SecretInteger: '189'
  battleship:
   Array:
    inner_type: SecretInteger
    values:
     - SecretInteger: '112'
     - SecretInteger: '122'
     - SecretInteger: '132'
     - SecretInteger: '142'
  submarine:
   Array:
    inner_type: SecretInteger
    values:
     - SecretInteger: '156'
     - SecretInteger: '157'
     - SecretInteger: '158'
  position:
   SecretInteger: '132'
 public_variables: {}
expected_outputs:
 out:
  SecretInteger: '0'

 */

const main = async () => {
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

main();
