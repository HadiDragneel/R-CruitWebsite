import {getScore} from 'backend/model';

$w.onReady(async function () {

    // TODO: This should be on the overview page for R'Cruit
    const THRESHOLD = 0.6

    const qualifications = [
        "Should be good with JavaScript",
        "You should be fluent in German",
        "Solid experience with English grammar is preferred"
    ]

    const experiences = [
        "I am fluent in English",
        "I have a strong understanding of the German language",
        "I have a lot of experience with JavaScript",
        "I have been a cook at Happy Italy"
    ]
    getScore(qualifications, experiences).then(score => {
        console.log(`The % match is: ${score * 100}%`)

        if (score > THRESHOLD) {
            // TODO: Write to data collection
        }
    })
});