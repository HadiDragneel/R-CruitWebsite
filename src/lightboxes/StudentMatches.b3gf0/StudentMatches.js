import wixData from "wix-data";
import { session } from 'wix-storage';
import wixWindow from 'wix-window';
import wixLocation from 'wix-location';
import { matchStudent } from "backend/model.jsw";

async function updateFields(userId) {
    console.log("Updating fields");
    wixData.query("StudentAccountsInfo")
        .eq("_id", userId)
        .include("CVs")
        .find()
        .then((results) => {
            if (results.items.length > 0) {
                let items = results.items;
                let item = items[0];
                $w("#studentName").text = item.firstName;
                $w("#studentEmail").text = item.title;
                let cvID = item.CVs[0]._id;
                session.setItem("cvID", cvID);

                wixData.query("MatchingData")
                    .eq("cvReference", cvID)
                    .include("vacancyReference")
                    .find()
                    .then((results) => {
                        console.log(results.items.length);
                        if (results.items.length > 0) {
                            let items = results.items;

                            while (items[0].vacancyReference.length > 5) {
                                items[0].vacancyReference.pop();
                            }


                            $w("#repeater1").data = exampleData.slice(0, items[0].vacancyReference.length);

                            $w("#repeater1").forEachItem(($item, itemData, index) => {
                                $item("#text75").text = items[0].vacancyReference[index].title;
                                $item("#text76").text = items[0].vacancyReference[index].jobDescription;
                                $item("#hiddenID").text = items[0].vacancyReference[index]._id;

                            });

                        } else {
                            $w("#repeater1").forEachItem(($item, itemData, index) => {
                                $item("#text75").text = "No matches yet, please click on 'Update' to generate matches!";
                                $item("#text76").text = "";
                            });
                        }
                    })
                    .catch((error) => {
                        let errorMsg = error.message;
                        let code = error.code;
                        console.log(errorMsg);
                        $w("#text81").text = "Something went wrong with acquiring the match information.";
                        $w("#text81").show();
                    });



            } else {
                $w("#text81").text = "Something went wrong with acquiring the student information.";
                $w("#text81").show();
            }
        })
        .catch((error) => {
            let errorMsg = error.message;
            let code = error.code;
            console.log(errorMsg);
            $w("#text81").text = "Something went wrong with acquiring the student information.";
            $w("#text81").show();
        });
}






const exampleData = [
    { "_id": "1"},
    { "_id": "2" },
    { "_id": "3" },
    { "_id": "4" },
    { "_id": "5" }
];

$w.onReady(() => {
    let userId = session.getItem("studentID");

    updateFields(userId);



    const experiences = []

    $w("#UpdateMatchesButton").onClick((event, $w) => {
        $w("#UpdateMatchesButton").disable();
        let cvID = session.getItem("cvID");

        wixData.query("CVs")
            .eq("_id", cvID)
            .find()
            .then((results) => {
                if (results.items.length > 0) {
                    results.items[0].experiences.forEach((element) => {
                        experiences.push(element["experience"]);
                    });

                    console.log("Start processing...");
                    
                    matchStudent(experiences, cvID).then(result => {
                        console.log("Finished, check to see if all went well.")
                        wixLocation.to(wixLocation.url);
                        $w("#UpdateMatchesButton").enable();
                    });


                    //console.log(results.items[0].experiences[0]["experience"]);
                } else {
                    $w("#text81").text = "Something went wrong with acquiring the cv information.";
                    $w("#text81").show();
                }
            })
            .catch((error) => {
                let errorMsg = error.message;
                let code = error.code;
                console.log(errorMsg);
                $w("#text81").text = "Something went wrong with acquiring the student information.";
                $w("#text81").show();
            });
    });

    $w("#repeater1").onItemReady(($w, itemData, index) => {
        $w("#vacancyInformation").onClick((event, $w) => {
            session.setItem("vacancyID", $w("#hiddenID").text);
            wixWindow.openLightbox("Vacancy");
        });
      
    });

    

});