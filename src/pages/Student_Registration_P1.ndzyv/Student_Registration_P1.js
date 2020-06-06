import wixData from 'wix-data';
import wixUsers from 'wix-users';
import wixLocation from 'wix-location';
import {getScore} from 'backend/model';


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
    $w('#submitButton').onClick((event) => {

        const experiences = [
            "I am a good chef",
            "I am very funny",
            "I have a lot of experience with Java"
        ];

        //email - ab@h.com
        //_id - 344033b4-f08c-4dfd-b39e-6613a6d38b06
        matchStudent(experiences, "9ec171cd-39dd-4785-9873-16d60439b7c2").then(result => {
            console.log("Done with register part 1")
        })

        // //Checks if all fields have been filled in
        // if ($w('#firstNameInput').valid && $w('#lastNameInput').valid && $w('#addressInput').valid && $w('#dateofbirthInput').valid && $w('#phoneInput').valid && $w('#nationalityInput').valid && $w('#emailInput').valid && $w('#passwordInput').valid) {
        //     registerStudentAccount()
        // }
        // else {
        //     console.log("Not all fields filled in");
        // }
    });

    function registerStudentAccount() {

        let email = $w("#emailInput").value;
        let password = $w("#passwordInput").value;
        let firstName = $w("#firstNameInput").value;
        let lastName = $w("#lastNameInput").value;

        // registers an account with the email, password and name given as wix member of the site.
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

// SINGLE student matching to ALL vacancy.
async function matchStudent(experiences, cv_id) {
    const THRESHOLD = 0.6;
    wixData.query("Vacancies")
        .find()
        .then(async (results) => {
            if (results.items.length > 0) {
                let arrayOfMatches = [];
                for (let i = 0; i < results.length; i++) {

                    const vacancy = results.items[i];
                    const qualifications = vacancy.qualifications;

                    let arrayOfQualifications = [];
                    let arrayOfHowLong = [];


                    for (let j = 0; j < qualifications.length; j++) {
                        arrayOfQualifications.push(qualifications[j]["qualification"]);
                        arrayOfHowLong.push(qualifications[j]["howLong"]);
                    }

                    // TODO: This code below block should be on the overview page for R'Cruit


                    await getScore(arrayOfQualifications, experiences).then(score => {
                        console.log(`The % match is: ${score * 100}%`);

                        if (score > THRESHOLD) {
                            arrayOfMatches.push(vacancy._id)
                        }
                    }).catch((err) => {
                        console.log(err);
                    })

                    // TODO: This code block above should be on the overview page for R'Cruit

                }

                let matchingData = {
                    "_id": cv_id,
                    "cvReference": cv_id
                };

                wixData.save("MatchingData", matchingData)
                    .then((results) => {
                        wixData.replaceReferences("MatchingData", "vacancyReference", cv_id, arrayOfMatches)
                            .then(() => {
                                console.log("Vacancy matches updated!");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    })


            } else {
                console.log("No vacancy match found.")
            }
        })
        .catch((err) => {
            console.log(err);
        });
}





