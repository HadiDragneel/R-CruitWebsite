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

$w.onReady(function () {

    const experiences = [];
    const user = wixUsers.currentUser;

    $w("#repeater1").data = [];

    $w("#addWorkButton").onClick((event) => {
        $w("#repeater1").data = exampleData.slice(0, ++added);
    });

    $w("#removeWorkButton").onClick((event) => {
            if (added > 0) {
                $w("#repeater1").data = exampleData.slice(0, --added);
            }
        }
    );

    $w("#submitButton").onClick((event) => {

            $w("#repeater1").forEachItem(($item, itemData, index) => {

                if ($item("#input8").value !== "") {
                    experiences.push(
                        {
                            ["experience" + index.toString()]: $item("#input8").value,
                            ["howLong" + index.toString()]: $item("#input9").value
                        }
                    )
                }
            });

            let toInsert = {
                "_id": user.id,
                "experiences": experiences
            };

            wixData.save("CVs", toInsert)
                .then((results) => {
                    console.log(results)
                })
                .catch((err) => {
                    console.log(err);
                });

            // TODO: Fix that experiences is being inserted in the wrong row

            console.log(experiences)
            console.log(user.id)

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