import wixWindow from 'wix-window';
import wixUsers from 'wix-users';
import wixData from 'wix-data';
import {updatePermissions} from 'public/permission';


const exampleData = [
    {"_id": "1"},
    {"_id": "2"},
    {"_id": "3"},
    {"_id": "4"},
    {"_id": "5"},
    {"_id": "6"},
    {"_id": "7"},
    {"_id": "8"},
    {"_id": "9"},
    {"_id": "10"}
];

let added = 0;

$w.onReady(function () {
    updatePermissions();

    const experiences = [];
    const user = wixUsers.currentUser;

    const inputFields = [
        $w("#input11"),
        $w("#input12"),
        $w("#input13"),
        $w("#input14"),
        $w("#input15")]

    $w("#repeater1").data = [];

    $w("#addWorkButton").onClick((event) => {
        if (added < exampleData.length) {
            $w("#repeater1").data = exampleData.slice(0, ++added);
        } else {
            $w("#text76").show();
        }
    });

    $w("#removeWorkButton").onClick((event) => {
            if (added > 0) {
                $w("#repeater1").data = exampleData.slice(0, --added);
            }
        }
    );

    $w("#submitButton").onClick((event) => {

            let isInvalid = false

            inputFields.forEach(field => {
                // TODO: Check for white space too
                if (!field.valid) {
                    isInvalid = true
                }
            })

            if (isInvalid) {
                console.log("[X] Invalid field found")
                $w("#text79").show()
                return
            }

            $w("#repeater1").forEachItem(($item, itemData, index) => {

                if ($item("#input8").valid) {
                    experiences.push(
                        {
                            "experience": $item("#input8").value,
                            "howLong": $item("#input9").value
                        }
                    )
                }
            });

            const radioOptions = $w("#radioGroup1").options
            let toInsert = {
                "weeklyHours": inputFields[0].value,
                "desiredContract": inputFields[1].value,
                "motivation": inputFields[2].value,
                "searchedForJob": inputFields[3].value,
                "timeInNl": inputFields[4].value,
                "heardAboutUs": radioOptions[$w("#radioGroup1").selectedIndex].label,
                "experiences": experiences
            };

            wixData.save("CVs", toInsert)
                .then((results) => {
                    console.log("[X] Inserted all but reference")
                    // TODO: Check in published site if student reference is broken due to user.id now it is
                    //  broken because the current user its id is not in the StudentAccountsInfo data collection
                    //  this needs to be fixed
                    let userID = user.id;
                    wixData.insertReference("CVs", "student", results._id, userID)
                        .then(() => {
                            console.log("[X] Inserted reference now too")
                            $w("#text79").hide()
                            $w("#text78").show()
                        })
                })
                .catch((error) => {
                    console.log("[X] And error occurred", error);
                    $w("#text75").hide()
                    $w("#text74").show()
                });

            let jump = false;

            for (let x = 1; x < 14; x++) {
                let validityObj = $w("#input" + x.toString()).validity;

                if (validityObj.valid == false) {

                    if (jump == false) {
                        jump = true;
                        $w("#input" + x.toString()).scrollTo()
                            .then(() => {
                                wixWindow.scrollBy(0, -100);
                            });
                    }

                    $w("#input" + x.toString()).updateValidityIndication();
                }

            }
        }
    );
});