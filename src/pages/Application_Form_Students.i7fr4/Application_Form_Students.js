import wixWindow from 'wix-window';

$w.onReady(function (){
    
    
    $w("#input1").onMouseIn(()=> //onMouseIn is the event handler.
   // The callback function starts here.
    {
        console.log("hoverin over");
        //$w("#button1").label = "Let's Go!";
        //This is the code that runs when the event occurs.
    }
  // The callback function ends here.
   );
    
    $w("#button1").onClick( (event) =>
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