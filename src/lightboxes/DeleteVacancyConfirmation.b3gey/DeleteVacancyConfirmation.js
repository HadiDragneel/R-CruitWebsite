import wixWindow from 'wix-window';

$w.onReady(function (){

    $w("#deleteLBYesButton").onClick( (event) =>
        {
            wixWindow.lightbox.close('ok');
        }
    );

    $w("#deleteLBNoButton").onClick( (event) =>
        {
            wixWindow.lightbox.close('cancel');
        }
    );


});