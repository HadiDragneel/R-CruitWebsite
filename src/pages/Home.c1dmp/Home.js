import {denseModel} from 'backend/tensorFlowDemo';

$w.onReady(function () {
    denseModel().then(model => {
        console.log("[X] Model: ", model)
    }, error => {
        console.log("[X] Error: ", error)
    })
});