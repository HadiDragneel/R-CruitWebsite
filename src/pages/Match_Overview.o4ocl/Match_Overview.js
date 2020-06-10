import wixData from "wix-data";
import {session} from 'wix-storage';
import wixWindow from 'wix-window';

$w.onReady(() => {
    /*$w("#dataset1").onReady( () => {

      $w("#repeater1").onItemReady( ($item, itemData, index) => {
        let theItem = itemData.jobDescription;
        var shortDescription = theItem.substr(0,150);
        $item("#descriptionStudent").text = shortDescription + "...";
      });

    } );*/


    ;


    let debounceTimer;
    let lastFilterTitle;
    let lastCreateFirst;
    let lastCreateLast;
    let lastUpdateFirst;
    let lastUpdateLast;
    let lastEmail;


    $w("#datePicker1").onChange((event) => {
        filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, lastEmail);
    });
    $w("#datePicker2").onChange((event) => {
        filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, lastEmail);

    });
    $w("#datePicker3").onChange((event) => {
        filter(lastFilterTitle, lastCreateFirst, lastCreateLast, $w('#datePicker3').value, lastUpdateLast, lastEmail);
    });
    $w("#datePicker4").onChange((event) => {
        filter(lastFilterTitle, lastCreateFirst, lastCreateLast, lastUpdateFirst, $w('#datePicker4').value, lastEmail);
    });


    $w("#IStudent").onKeyPress((event) => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = undefined;
        }

        debounceTimer = setTimeout(() => {
            filter($w('#IStudent').value, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, lastEmail);
        }, 200);
    });

    $w("#iEmail").onKeyPress((event) => {

        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = undefined;
        }

        debounceTimer = setTimeout(() => {
            filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, $w('#iEmail').value);
        }, 200);
    });


    function filter(firstname, createFirst, createLast, updateFirst, updateLast, email) {
        if (lastFilterTitle !== firstname || lastCreateFirst !== createFirst || lastCreateLast !== createLast || lastUpdateFirst !== updateFirst || lastUpdateLast !== updateLast || lastEmail !== email) {

            let newFilter = wixData.filter();
            if (firstname) {
                newFilter = newFilter.contains('firstName', firstname);
            }
            if (createFirst || createLast) {
                newFilter = newFilter.between("_createdDate", createFirst, createLast);
            }
            if (updateFirst || updateLast) {
                newFilter = newFilter.between("_updatedDate", updateFirst, updateLast);
            }
            if (email) {
                newFilter = newFilter.contains('title', email);
            }


            $w('#dataset1').setFilter(newFilter);
            lastFilterTitle = firstname;
            lastCreateFirst = createFirst;
            lastCreateLast = createLast;
            lastUpdateFirst = updateFirst;
            lastUpdateLast = updateLast;
            lastEmail = email;
        }
    }


    $w("#repeater1").onItemReady(($w, itemData, index) => {

        let options = {
            "order": "asc"
        };

        wixData.queryReferenced("StudentAccountsInfo", itemData["_id"], "CVs", options)
            .then((results) => {
                if (results.items.length > 0) {
                    for (let item = 0; item < results.items.length; item++) {
                        // TODO: Refactor code and change names according to how it is formulated in the CV

                        const experiences = results.items[item]["experiences"]
                        let experiencesString = ""
                        console.log("Experiences", experiences)

                        for (let i = 0; i < experiences.length; i++) {
                            const experience = experiences[i]
                            console.log("Experience", experiencesString)
                            experiencesString = experiencesString.concat(experience["experience"] + " | " + experience["howLong"] + "\n")
                        }

                        $w("#text84").text = experiencesString

                        const result = results.items[item]

                        $w("#text86").text = result["weeklyHours"].toString() + " hours"
                        $w("#text88").text = result["desiredContract"]
                        $w("#text90").text = result["motivation"]
                        $w("#text92").text = result["searchedForJob"]
                        $w("#text94").text = result["timeInNl"]
                        $w("#text97").text = result["heardAboutUs"]
                    }

                } else {
                    // handle case when no students are found -> why?
                }
            })
            .catch((err) => {
                $w("#text100").text = "Something went wrong, please try again later.";
                $w("#text100").show();
            });

        $w("#matchInformation").onClick((event, $w) => {
            session.setItem("studentID", $w("#hiddenID").text);
            wixWindow.openLightbox("StudentMatches");
        });

    });


});