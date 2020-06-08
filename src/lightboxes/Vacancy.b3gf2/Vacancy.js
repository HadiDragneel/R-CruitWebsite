import wixWindow from 'wix-window';
import wixUsers from 'wix-users';
import wixData from 'wix-data'
import { session } from 'wix-storage';


const exampleData = [
    { "_id": "1" },
    { "_id": "2" },
    { "_id": "3" },
    { "_id": "4" },
    { "_id": "5" },
    { "_id": "6" },
    { "_id": "7" },
    { "_id": "8" },
    { "_id": "9" },
    { "_id": "10" }
];

$w.onReady(function () {

    wixData.query("Vacancies")
         .eq("_id", session.getItem("vacancyID"))
         .include("CompanyAccountsInfo-1")
         .find()
         .then((results) => {
            if (results.items.length > 0) {
                let items = results.items;
                $w("#text72").text = items[0].title;
                $w("#text76").text = items[0].jobDescription;
                $w("#text78").text = items[0].hoursInWeek;
                $w("#text77").text = items[0].studentsNeeded.toString();
                $w("#text82").text = items[0]["CompanyAccountsInfo-1"][0]["companyName"];
                $w("#text84").text = items[0]["CompanyAccountsInfo-1"][0]["title"];
                $w("#text87").text = items[0]["CompanyAccountsInfo-1"][0]["phoneNumber"];
                $w("#text86").text = items[0]["CompanyAccountsInfo-1"][0]["address"]["formatted"];

                console.log(items[0]["CompanyAccountsInfo-1"][0]);

                $w("#repeater1").data = exampleData.splice(0, items[0].qualifications.length - 1);
                $w("#repeater1").forEachItem(($item, itemData, index) => {
                    $item("#QualificationItem").text = items[0].qualifications[index]["qualification"];
                    $item("#QualificationTime").text = items[0].qualifications[index]["howLong"];

                });





            }
          });



    $w("#close").onClick((event, $w) => {
        wixWindow.openLightbox("StudentMatches");
    });
});