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
            $w("#text76").hide();

            let email = $w('#email').value;
            let password = $w('#password').value;
            let companyName = $w('#companyName').value;
            let address = $w('#address').value;
            let phoneNumber = $w('#phoneNumber').value;

            await registerCompanyAccount(email, password, companyName);
            await submitToDatabase(email, companyName, address, phoneNumber);

        } else {
            $w("#text76").text = "Please fill in all the required fields. (with an *)";
            $w("#text76").show();
        }

    });

    async function registerCompanyAccount(email, password, companyName) {

        await wixUsers.register(email, password, {
            contactInfo: {
                "firstName": companyName
            }
        })
            .catch((err) => {
            $w("#text76").text = "There was an error creating your account, please try again or contact R'Cruit.";
            $w("#text76").show();
        });

        await wixUsers.login(email, password)
            .then( () => {
                console.log("[X] User has been logged in.");
                $w("#text76").hide();
            } )
            .catch( (err) => {
                $w("#text76").text = "There was an error creating your account, please try again or contact R'Cruit.";
                $w("#text76").show();
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
            $w("#text76").text = "There was an error creating your account, please try again or contact R'Cruit.";
            $w("#text76").show();
        } );


    //Notifies R'Cruit about the new account that was just created
    companyRegistrationEmail(companyName);
    wixLocation.to('/create_vacancy'); // Redirects to create vacancy
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