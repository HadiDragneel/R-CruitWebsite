// import {denseModel} from 'backend/tensorFlowDemo';
import {tokenize} from 'backend/preProcess';

$w.onReady(function () {
    // denseModel().then(model => {
    //     console.log("[X] Model: ", model)
    // }, error => {
    //     console.log("[X] Error: ", error)
    // })

    tokenize()
});