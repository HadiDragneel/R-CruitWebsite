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

    $w('#submitButton').onClick(async (event) => {
        if ($w('#companyName').valid && $w('#address').valid && $w('#phoneNumber').valid && $w('#email').valid && $w('#password').valid) {

            let email = $w('#email').value;
            let password = $w('#password').value;
            let companyName = $w('#companyName').value;
            let address = $w('#address').value;
            let phoneNumber = $w('#phoneNumber').value;

            await registerCompanyAccount(email, password, companyName);
            await submitToDatabase(email, companyName, address, phoneNumber);

        } else {
            console.log("Not all fields filled in");
        }

    });

    async function registerCompanyAccount(email, password, companyName) {

        await wixUsers.register(email, password, {
            contactInfo: {
                "firstName": companyName
            }
        });

        await wixUsers.login(email, password)
            .then( () => {
                console.log("[X] User has been logged in.");
            } )
            .catch( (err) => {
                console.log(err);
            });
    }

});

function submitToDatabase(email, companyName, address, phoneNumber) {
    let user = wixUsers.currentUser;
    let userId = user.id;

    let toInsert = {
        "title": email,
        "_id": userId,
        "companyName": companyName,
        "address": address,
        "phoneNumber": phoneNumber
    }


    // Inserts the company info from the form into companyAccountsInfo database
    wixData.insert("CompanyAccountsInfo", toInsert)
        .then( (results) => {
            let item = results; //see item below
        } )
        .catch( (err) => {
            let errorMsg = err;
        } );

    //Notifies R'Cruit about the new account that was just created
    companyRegistrationEmail(companyName);

    // Redirects the user to another specified page
    wixLocation.to('/home'); // Redirects to home page
}

function companyRegistrationEmail(name) {
    wixUsers.emailUser('companyRegistrationNotification', "eec88993-fa00-49bb-81b3-b4e8bd8c80e3", {
        variables: {
            companyName: name
        }}).then((result)=>{
        console.log("email notification sent")
    }).catch((err)=>{
        console.log(err);
    })
}