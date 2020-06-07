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

            registerCompanyAccount()

        } else {
            console.log("Not all fields filled in");
        }

    });

    function registerCompanyAccount() {

        let email = $w('#email').value;
        let password = $w('#password').value;
        let companyName = $w('#companyName').value;
        let address = $w('#address').value;
        let phoneNumber = $w('#phoneNumber').value;

        wixUsers.register(email, password, {
            contactInfo: {
                "firstName": companyName
            }
        });

        let userId = wixUsers.currentUser.id;

        let toInsert = {
            "title": email,
            "_id": userId,
            "companyName": companyName,
            "address": address,
            "phoneNumber": phoneNumber
        }

        wixData.insert("CompanyAccountsInfo", toInsert)
        .then( (results) => {
            let item = results; //see item below
        } )
        .catch( (err) => {
            let errorMsg = err;
        } );

        //$w('#companyDataset').save(); // Saves extra info to the "CompanyAccountInfo" database
        wixLocation.to('/home'); // Redirects to home page


    }




});