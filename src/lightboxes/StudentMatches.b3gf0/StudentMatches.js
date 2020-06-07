import wixData from "wix-data";
import { session } from 'wix-storage';
import wixWindow from 'wix-window';

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

                            //items.forEach(item => );
                            console.log($w("#repeater1").data);

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