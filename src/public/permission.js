import wixData from 'wix-data';
import wixLocation from 'wix-location';
import wixUsers from 'wix-users';

// This JS file checks what type of account the user has (Student or Company). Based on the result, it changes the site layout or redirects the user to another page.


// Checks if the user is logged in, returns bool.
export function isLoggedIn() {
    let user = wixUsers.currentUser;
    let loggedIn = user.loggedIn;

    return loggedIn;
}

// Checks if the given userID belongs to a company/employer
export async function checkIfEmployer (userID) {
    let isEmployer = false;
    await wixData.query("CompanyAccountsInfo")
        .eq("_id", userID)
        .find()
        .then( (results) => {
            if(results.items.length > 0) {
                isEmployer = true;
            }
        } )
        .catch( (err) => {
            console.log(err);
        } );
    return isEmployer;
}

// Checks if the given userID belongs to a student
export async function checkIfStudent (userID) {
    let isStudent = false;
    await wixData.query("StudentAccountsInfo")
        .eq("_id", userID)
        .find()
        .then( (results) => {
            if (results.items.length > 0) {
                isStudent = true;
            }
        })
        .catch((err) => {
            console.log(err);
        });
    return isStudent;
}



export async function updatePermissions  () {
    let user = wixUsers.currentUser;
    let userID = user.id;
    let isLogged = user.loggedIn;


    if (isLogged) {
        if (checkIfStudent(userID)) {
            updateForStudent();
            console.log("set to student mode");
        }
        else if (checkIfEmployer(userID)) {
            updateForEmployer();
            console.log("set to employer mode");
        }
        else {
            updateForAdmin();
            console.log("set to admin mode");
        }
    } else {
        setToDefault();
    }
}


function updateForEmployer() {
    setToDefault();
    $w('#createVacancy').expand();
    $w('#myVacancies').expand();
    $w('#logInOutButton').label = "Logout";

}

function updateForStudent() {
    setToDefault();
    $w('#createCV').expand();
    $w('#logInOutButton').label = "Logout";
}

function updateForAdmin() {
    setToDefault();
    $w('#adminVacancy').expand();
    $w('#createCV').expand();
    $w('#logInOutButton').label = "Logout";
}

function setToDefault () {
    $w('#topMenu').collapse()
    $w('#logInOutButton').label = "Login";
    $w('#createCV').collapse();
    $w('#createVacancy').collapse();
    $w('#myVacancies').collapse();
    $w('#adminVacancy').collapse();
    $w('#topMenu').expand();
}