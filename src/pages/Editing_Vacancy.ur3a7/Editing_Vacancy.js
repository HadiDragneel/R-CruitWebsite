import wixWindow from 'wix-window';


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




$w.onReady(function (){

    $w("#deleteVacancyButton").onClick( (event) => {
        wixWindow.openLightbox('DeleteVacancyConfirmation')
            .then(res => {
                if (res === 'ok')
                    return null;
            });
    } );

    $w("#repeater1").data = [];

    $w("#addQualificationButton").onClick( (event) => {
        $w("#repeater1").data = exampleData.slice(0, ++added);
    } );

    $w("#removeQualificationButton").onClick( (event) =>
        {
            if (added > 0) {
                $w("#repeater1").data = exampleData.slice(0, --added);
            }
        }
    );

    $w("#changeConfirmation").onClick( (event) =>
        {

            let jump = false;

            for (let x = 1; x < 14; x++){
                let validityObj = $w("#input" + x.toString()).validity;

                if (validityObj.valid == false) {

                    if (jump == false) {
                        jump = true;
                        $w("#input" + x.toString()).scrollTo()
                            .then( ( ) => {
                                wixWindow.scrollBy(0, -100);
                            } );
                    }

                    $w("#input" + x.toString()).updateValidityIndication();
                }

            }

        }
    );

});