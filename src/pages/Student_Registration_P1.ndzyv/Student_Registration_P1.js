import wixWindow from 'wix-window';
import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import { session } from 'wix-storage';


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

    //Submit button function
    $w('#submitButton').onClick(async (event) => {

        //let hadiUserID = "eec88993-fa00-49bb-81b3-b4e8bd8c80e3";
        //let userID = "eec88993-fa00-49bb-81b3-b4e8bd8c80e3"; // Hadi's user ID, temporary for testing

        //Checks if all fields have been filled in
        if ($w('#firstNameInput').valid && $w('#lastNameInput').valid && $w('#addressInput').valid && $w('#dateofbirthInput').valid && $w('#phoneInput').valid && $w('#nationalityInput').valid && $w('#emailInput').valid && $w('#passwordInput').valid) {
            $w("#text77").hide();


            let email = $w("#emailInput").value;
            let password = $w("#passwordInput").value;
            let firstName = $w("#firstNameInput").value;
            let lastName = $w("#lastNameInput").value;
            let address = $w('#addressInput').value;
            let dateOfBirth = $w('#dateofbirthInput').value;
            let phoneNumber = $w('#phoneInput').value;
            let nationality = $w('#nationalityInput').value;

            await registerStudentAccount(email, password, firstName, lastName);
            await submitToDatabase(email, firstName, lastName, address, dateOfBirth, phoneNumber, nationality);

        } else {
            $w("#text77").text = "Please fill in all the required fields. (with an *)";
            $w("#text77").show();
            console.log("not filled in");
        }
    })

    async function registerStudentAccount(email, password, firstName, lastName) {

        // registers an account with the email, password and name given as Wix member of the site.
        await wixUsers.register(email, password, {
            contactInfo: {
                "firstName": firstName,
                "lastName": lastName
            }

        }).then((result) => {
            console.log("[X] Registered account.");
        });

        await wixUsers.login(email, password)
            .then( () => {
                console.log("[X] User has been logged in.");
            } )
            .catch( (err) => {
                console.log(err);
                $w("#text77").text = "There was an error creating your account, please try again or contact R'Cruit.";
                $w("#text77").show();
            });

    }

});

async function submitToDatabase(email, firstName, lastName, address, dateOfBirth, phoneNumber, nationality) {

    let user = wixUsers.currentUser;
    let userId = user.id;

    let toInsert = {
        "title": email,
        "_id": userId,
        "firstName": firstName,
        "lastName": lastName,
        "address": address,
        "dateOfBirth": dateOfBirth,
        "phoneNumber": phoneNumber,
        "nationality": nationality
    }



    //Saves the additional info to database then redirects to part 2 of registration
    wixData.insert("StudentAccountsInfo", toInsert)
        .then((results) => {
            let item = results; //see item below
            //Redirects user to another page, in this case CV creation page
            wixLocation.to("/student-registration-p2");
        })
        .catch((err) => {
            let errorMsg = err;
            console.log("[X] Could not save user in studentAccountsInfo", err);
            $w("#text77").text = "There was an error creating your account, please try again or contact R'Cruit.";
            $w("#text77").show();
        });

    // Notifies R'Cruit about new registration
    studentRegistrationNotification(firstName);


}

function studentRegistrationNotification(firstName) {
    wixUsers.emailUser("studentRegistrationNotification", "eec88993-fa00-49bb-81b3-b4e8bd8c80e3", {
        variables: {
            userName: firstName
        }
    })
        .then(() => {
            console.log("email sent");
            // do something after the email was sent successfully
        })
        .catch((err) => {
            console.log(err);
            // handle error that prevented the email from being sent
        });
}
