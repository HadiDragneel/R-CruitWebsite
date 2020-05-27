import wixWindow from 'wix-window';
import wixUsers from 'wix-users';
import wixData from 'wix-data'

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

    const qualifications = [];
    const user = wixUsers.currentUser;

    const inputFields = [
        $w("#input18"),
        $w("#textBox1"),
        $w("#input8"),
        $w("#input16"),
        $w("#input17")]

    $w("#repeater1").data = [];

    $w("#button2").onClick((event) => {
        $w("#repeater1").data = exampleData.slice(0, ++added);
    });

    $w("#button3").onClick((event) => {
        if (added > 0) {
            $w("#repeater1").data = exampleData.slice(0, --added);
        }
    });

    $w("#button4").onClick(event => {
        let isEmptyField = false

        if (!$w("#checkbox1").checked) {
            console.log("[X] Checkbox not checked")
            return
        }

        inputFields.forEach(field => {
            // TODO: Check for white space too
            if (field.value === "") {
                isEmptyField = true
            }
        })

        if (isEmptyField) {
            console.log("[X] Empty field found")
            return
        }

        $w("#repeater1").forEachItem(($item, itemData, index) => {
            if ($item("#input14").value !== "") {
                qualifications.push(
                    {
                        ["qualification" + index.toString()]: $item("#input14").value,
                        ["howLong" + index.toString()]: $item("#input15").value
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
            "qualifications": qualifications
        };

        wixData.save("Vacancies", toInsert)
            .then((results) => {
                console.log("[X] Inserted all but reference")
                // TODO: Check in published site if student reference is broken due to user.id now it is
                //  broken because the current user its id is not in the EmployersAccountInfo data collection
                //  this needs to be fixed 
                wixData.insertReference("Vacancies", "CompanyAccountsInfo-1", results._id, user.id)
                    .then(() => console.log("[X] Inserted reference now too"))
            })
            .catch((error) => {
                console.log("[X] And error occurred", error);
            });
    })

    $w("#button1").onClick((event) => {

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