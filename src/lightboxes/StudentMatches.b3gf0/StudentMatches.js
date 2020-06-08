import wixData from "wix-data";
import { session } from 'wix-storage';
import wixWindow from 'wix-window';


const exampleData = [
    { "_id": "1"},
    { "_id": "2" },
    { "_id": "3" },
    { "_id": "4" },
    { "_id": "5" }
];

$w.onReady(() => {
    let userId = session.getItem("studentID");

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

                wixData.query("MatchingData")
                    .eq("cvReference", cvID)
                    .include("vacancyReference")
                    .find()
                    .then((results) => {
                        if (results.items.length > 0) {
                            let items = results.items;
                            $w("#repeater1").data = exampleData.slice(0, items[0].vacancyReference.length);

                            $w("#repeater1").forEachItem(($item, itemData, index) => {
                                $item("#text75").text = items[0].vacancyReference[index].title;
                                $item("#text76").text = items[0].vacancyReference[index].jobDescription;

                            });


                            


                            //$w("#text75").text = item.vacancyReference[0].title;
                            //$w("#text76").text = item.vacancyReference[0].jobDescription;
                            //console.log(item.vacancyReference[0].title);
                        } else {
                            console.log("no result 2");
                        }
                    })
                    .catch((error) => {
                        let errorMsg = error.message;
                        let code = error.code;
                        console.log(errorMsg);
                    });



            } else {
                console.log("no result 1");
            }
        })
        .catch((error) => {
            let errorMsg = error.message;
            let code = error.code;
            console.log(errorMsg);
        });



    

});