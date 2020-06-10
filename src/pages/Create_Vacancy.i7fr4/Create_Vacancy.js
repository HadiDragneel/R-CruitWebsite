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

// TODO: Insert qualifications in data collection field of current user its created vacancy
$w.onReady(function () {

    updatePermissions();

    const qualifications = [];
    const user = wixUsers.currentUser;

    const inputFields = [
        $w("#input18"),
        $w("#textBox1"),
        $w("#input8"),
        $w("#input16"),
        $w("#input17"),
        $w("#wageInput")
    ]

    $w("#repeater1").data = [];

    $w("#button2").onClick((event) => {
        if (added < exampleData.length) {
            $w("#repeater1").data = exampleData.slice(0, ++added);
        } else {
            $w("#text76").show();
        }
    });

    $w("#button3").onClick((event) => {
        if (added > 0) {
            $w("#repeater1").data = exampleData.slice(0, --added);
            if ($w("#text76").hidden == false) { $w("#text76").hide(); }
        }

    });

    $w("#button4").onClick(event => {
        let isInvalid = false

        if (!$w("#checkbox1").checked) {
            $w("#text77").show();
            return
        } else {
            $w("#text77").hide();
        }

        inputFields.forEach(field => {
            // TODO: Check for white space too
            if (!field.valid) {
                isInvalid = true
            }
        })

        if (isInvalid) {
            console.log("[X] Invalid field found")
            $w("#text75").show()
            return
        }

        $w("#repeater1").forEachItem(($item, itemData, index) => {
            if ($item("#input14").value !== "") {
                qualifications.push(
                    {
                        "qualification": $item("#input14").value,
                        "howLong": $item("#input15").value
                    }
                )
            }
        });

        let toInsert = {
            "title": inputFields[0].value,
            "jobDescription": inputFields[1].value,
            "studentsNeeded": inputFields[2].value,
            "timeStudentsNeeded": inputFields[3].value,
            "hoursInWeek": inputFields[4].value,
            "hourlyWage": inputFields[5].value,
            "qualifications": qualifications
        };

        wixData.save("Vacancies", toInsert)
            .then((results) => {
                console.log("[X] Inserted all but reference")
                // TODO: Check in published site if student reference is broken due to user.id now it is
                //  broken because the current user its id is not in the EmployersAccountInfo data collection
                //  this needs to be fixed
                let userID = user.id;
                wixData.insertReference("Vacancies", "CompanyAccountsInfo-1", results._id, userID)
                    .then(() => {
                        console.log("[X] Inserted reference now too")
                        $w("#text75").hide()
                        $w("#text73").show()
                    }
                    )
            })
            .catch((error) => {
                console.log("[X] And error occurred", error);
                $w("#text75").hide()
                $w("#text74").show()
            });
    });



});