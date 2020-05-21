import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixLocation from 'wix-location';



$w.onReady(function () {

    //Disables the submission button until ToS has been agreed
    $w('#submitButton').disable();

    //Check for ToS agreement. Makes submission enabled or disabled based on current checkbox status
    $w('#tosCheck').onChange((event => {
        let isAgreed = $w('#tosCheck').checked;
        if (isAgreed) {
            $w('#submitButton').enable();
        }
        else {
            $w('#submitButton').disable();
        }
    }));

    //Submit button function
    $w('#submitButton').onClick((event)=>  {

        //Checks if all fields have been filled in
        if ($w('#firstNameInput').valid && $w('#lastNameInput').valid && $w('#addressInput').valid && $w('#dateofbirthInput').valid && $w('#phoneInput').valid && $w('#nationalityInput').valid && $w('#emailInput').valid && $w('#passwordInput').valid) {
            registerStudentAccount()
        }
        else {
            console.log("Not all fields filled in");
        }
    })

    function registerStudentAccount() {

        let email = $w("#emailInput").value;
        let password = $w("#passwordInput").value;
        let firstName = $w("#firstNameInput").value;
        let lastName = $w("#lastNameInput").value;

        // registers an account with the email and password given as wix member of the site
        wixUsers.register(email, password, {
            contactInfo: {
                "firstName": firstName,
                "lastName": lastName
            }
        });

        //Saves the additional info to database then redirects to part 2 of registration
        $w('#studentAccountInfoDataset').save();
        //Redirects user to another page, in this case CV creation page
        wixLocation.to("/student-registration-p2");

    }


});



