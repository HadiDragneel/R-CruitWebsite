import wixData from 'wix-data';
import wixLocation from 'wix-location';

export function yourInput_click(event, $w) {
	let input1 = $w('#input1').value;
	let input2 = $w('#input2').value;
	wixData.query("User information")
		.eq('Email', input1)
		.eq('Password', input2)
		.find()
		.then((results) => {
			if (results.items.length > 0) {
				wixLocation.to(`/${results[0]._id}`);
				//or your desired location.
			}
		});
}