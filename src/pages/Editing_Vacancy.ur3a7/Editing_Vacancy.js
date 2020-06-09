import wixWindow from 'wix-window';
import wixData from 'wix-data';
import { session } from 'wix-storage';
import wixLocation from "wix-location";


const qualifications = [];


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
    {"_id": "10"},
    {"_id": "11"},
    {"_id": "12"},
    {"_id": "13"}
];

let added = 0;



$w.onReady(function () {
    const inputFields = [
        $w("#EditJobTitle"),
        $w("#EditJobDescription"),
        $w("#EditAmountStudent"),
        $w("#EditDurationStudent"),
        $w("#EditWeeklyHours"),
        $w("#EditHourlyWage")
    ]

    $w("#EditQualificationsRepeater").data = [];

    wixData.query("Vacancies")
         .eq("_id", session.getItem("vacancyID"))
         .find()
         .then((results) => {
            if (results.items.length > 0) {
                let items = results.items;
                $w("#EditJobTitle").value = items[0].title;
                $w("#EditJobDescription").value = items[0].jobDescription.substr(0,150);
                $w("#EditAmountStudent").value = items[0].studentsNeeded.toString();
                $w("#EditDurationStudent").value = items[0].timeStudentsNeeded;
                $w("#EditWeeklyHours").value = items[0].hoursInWeek;
                $w("#EditHourlyWage").value = items[0].hourlyWage;
                

                $w("#EditQualificationsRepeater").data = exampleData.splice(0, items[0].qualifications.length);
                $w("#EditQualificationsRepeater").forEachItem(($item, itemData, index) => {
                    added++;
                    $item("#EditQualification").value = items[0].qualifications[index]["qualification"];
                    $item("#EditHowLong").value = items[0].qualifications[index]["howLong"];
                    exampleData[index] = $w("#EditQualificationsRepeater").data[index];
                });



            } else{
                console.log(session.getItem("vacancyID"));
            }
          });




    $w("#deleteVacancyButton").onClick( (event) => {
        
        wixWindow.openLightbox('DeleteVacancyConfirmation')
            .then(res => {
                if (res === 'ok')
                    wixData.remove('Vacancies', session.getItem("vacancyID"));
                    wixLocation.to("/vacancy-overview")
                    return null;
            });
    } );


    $w("#addQualificationButton").onClick( (event) => {
        $w("#EditQualificationsRepeater").data = exampleData.slice(0, ++added);
    } );

    $w("#removeQualificationButton").onClick( (event) =>
        {
            if (added > 0) {
                $w("#EditQualificationsRepeater").data = exampleData.slice(0, --added);
            }
        }
    );


    $w("#changeConfirmation").onClick(event => {

        let isInvalid = false

        inputFields.forEach(field => {
            // TODO: Check for white space too
            if (!field.valid) {
                isInvalid = true

            }
        })

        if (isInvalid) {
            console.log("[X] Invalid field found")
            $w("#text74").show()
            return
        }

        $w("#EditQualificationsRepeater").forEachItem(($item, itemData, index) => {
            if ($item("#EditQualification").value !== "") {
                qualifications.push(
                    {
                        "qualification": $item("#EditQualification").value,
                        "howLong": $item("#EditHowLong").value

                    }

                ) 
            }
        });

        let toInsert = {
            "_id" : session.getItem("vacancyID"),
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
                console.log("Success");
                $w("#text74").hide()
                $w("#text73").show()
                wixLocation.to("/vacancy-overview");

            })
            .catch((error) => {
                console.log("[X] And error occurred", error);
                $w("#text73").hide()
                $w("#text74").show()
            });
    });
});
