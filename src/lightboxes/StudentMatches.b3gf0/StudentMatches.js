import wixData from "wix-data";
import { session } from 'wix-storage';
import wixWindow from 'wix-window';
//import { matchStudent } from "backend/model.jsw";
const use = require('@tensorflow-models/universal-sentence-encoder');


/*async function getScore(qualifications, experiences) {
    const qualifications_and_experiences = qualifications.concat(experiences)
    const model = await use.load()

    const similarityScore = async (firstSentence, secondSentence, embeddings) => {
        const firstSentenceEmbeddings = embeddings.slice([firstSentence, 0], [1])
        const secondSentenceEmbeddings = embeddings.slice([secondSentence, 0], [1])
        const firstSentenceT = false
        const secondSentenceT = true
        const scoreData = await firstSentenceEmbeddings
            .matMul(secondSentenceEmbeddings, firstSentenceT, secondSentenceT)
            .data()
        return scoreData[0]
    }

    const embeddings = await model.embed(qualifications_and_experiences)

    let scores = []
    let experienceLength = experiences.length
    let tempScores = []

    for (let qualification = 0; qualification < qualifications.length; qualification++) {

        for (let j = 0; j < experienceLength; j++) {
            const experience = qualifications_and_experiences.indexOf(experiences[j])
            const tempScore = await similarityScore(qualification, experience, embeddings)

            // TODO: Cleanup demo
            console.log(`\nThe % match between
            Qualification ${qualification}: ${qualifications_and_experiences[qualification]} |AND| Experience ${j}: ${qualifications_and_experiences[experience]}
            = ${tempScore * 100}%\n`)
            tempScores.push(tempScore)
        }
        scores.push(Math.max(...tempScores))
        tempScores = []
    }

    const average = (array) => array.reduce((a, b) => a + b) / qualifications.length
    return average(scores)
}

// SINGLE student matching to ALL vacancy.
export async function matchStudent(arrayOfExperiences, cv_id) {
    console.log("running");
    const THRESHOLD = 0.6;
    wixData.query("Vacancies")
        .find()
        .then(async (results) => {
            if (results.items.length > 0) {
                let arrayOfMatches = [];
                for (let i = 0; i < results.length; i++) {

                    const vacancy = results.items[i];
                    const qualifications = vacancy.qualifications;

                    let arrayOfQualifications = [];
                    let arrayOfHowLong = [];


                    for (let j = 0; j < qualifications.length; j++) {
                        arrayOfQualifications.push(qualifications[j]["qualification"]);
                        arrayOfHowLong.push(qualifications[j]["howLong"]);
                    }

                    // TODO: This code below block should be on the overview page for R'Cruit


                    await getScore(arrayOfQualifications, arrayOfExperiences).then(score => {
                        console.log(`The % match is: ${score * 100}%`);

                        if (score > THRESHOLD) {
                            arrayOfMatches.push(vacancy._id)
                        }
                    }).catch((err) => {
                        console.log(err);
                    })

                    // TODO: This code block above should be on the overview page for R'Cruit

                }

                let matchingData = {
                    "_id": cv_id,
                    "cvReference": cv_id
                };

                wixData.save("MatchingData", matchingData)
                    .then((results) => {
                        wixData.replaceReferences("MatchingData", "vacancyReference", cv_id, arrayOfMatches)
                            .then(() => {
                                console.log("Vacancy matches updated!");
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch((err) => {
                        console.log(err);
                    })


            } else {
                console.log("No vacancy match found.")
            }
        })
        .catch((err) => {
            console.log(err);
        });
}

*/

async function updateFields(userId) {
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
                    });


                    //console.log(results.items[0].experiences[0]["experience"]);
                } else {
                    console.log("no resulkt");
                }
            });


    });

    

});