import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import wixWindow from 'wix-window';
import wixData from 'wix-data';


$w.onReady(function () {

    //Disables the submission button until ToS has been agreed
    $w('#submitButton').disable();

    //Check for ToS agreement. Makes submission enabled or disabled based on current checkbox status
    $w('#tosCheck').onChange((event => {
        let isAgreed = $w('#tosCheck').checked;
        if (isAgreed) {
            $w('#submitButton').enable();
        } else {
            $w('#submitButton').disable();
        }
    }));

    $w('#submitButton').onClick((event) => {
        if ($w('#companyName').valid && $w('#address').valid && $w('#phoneNumber').valid && $w('#email').valid && $w('#password').valid) {

            let email = $w('#email').value;
            let password = $w('#password').value;
            let companyName = $w('#companyName').value;

            wixUsers.register(email, password, {
                contactInfo: {
                    "firstName": companyName
                }
            });

            $w('#companyDataset').save().then((event) => {
                wixLocation.to('/home');
            });

        } else {
            console.log("Not all fields filled in");
        }


    });



});