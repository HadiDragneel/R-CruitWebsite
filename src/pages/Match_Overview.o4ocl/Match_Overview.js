import wixData from "wix-data";
<<<<<<< HEAD
import { session } from 'wix-storage';
import wixWindow from 'wix-window';

$w.onReady( () => {
  /*$w("#dataset1").onReady( () => {
=======

$w.onReady( () => {
  $w("#dataset1").onReady( () => {
>>>>>>> fd036174286879781cd665e353e4616dd726e56a

    $w("#repeater1").onItemReady( ($item, itemData, index) => {
      let theItem = itemData.jobDescription;
      var shortDescription = theItem.substr(0,150);
      $item("#descriptionStudent").text = shortDescription + "...";
    });

<<<<<<< HEAD
  } );*/
    
  
    
    ;
=======
  } );
    
  
    
    
>>>>>>> fd036174286879781cd665e353e4616dd726e56a
    
    
    let debounceTimer;
    let lastFilterTitle;
    let lastCreateFirst;
    let lastCreateLast;
    let lastUpdateFirst;
    let lastUpdateLast;
<<<<<<< HEAD
    let lastEmail;
=======
>>>>>>> fd036174286879781cd665e353e4616dd726e56a
    
    

$w("#datePicker1").onChange( (event) => {  
<<<<<<< HEAD
          filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, lastEmail);
  });  
$w("#datePicker2").onChange( (event) => {  
          filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, lastEmail);
      
  });
$w("#datePicker3").onChange( (event) => {  
          filter(lastFilterTitle, lastCreateFirst, lastCreateLast, $w('#datePicker3').value, lastUpdateLast, lastEmail);
  });
$w("#datePicker4").onChange( (event) => {  
          filter(lastFilterTitle, lastCreateFirst, lastCreateLast, lastUpdateFirst, $w('#datePicker4').value, lastEmail);
=======
          filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast);
  });
    
$w("#datePicker2").onChange( (event) => {  
          filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast);
      
  });
$w("#datePicker3").onChange( (event) => {  
          filter(lastFilterTitle, lastCreateFirst, lastCreateLast, $w('#datePicker3').value, lastUpdateLast);
  });
$w("#datePicker4").onChange( (event) => {  
          filter(lastFilterTitle, lastCreateFirst, lastCreateLast, lastUpdateFirst, $w('#datePicker4').value);
>>>>>>> fd036174286879781cd665e353e4616dd726e56a
  });
    
    
  $w("#IStudent").onKeyPress( (event) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
          debounceTimer = undefined;
      }
      
        debounceTimer = setTimeout(() => {
<<<<<<< HEAD
            filter($w('#IStudent').value, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, lastEmail);
        }, 200);
  });    

    $w("#iEmail").onKeyPress((event) => {

        if (debounceTimer) {
            clearTimeout(debounceTimer);
            debounceTimer = undefined;
        }

        debounceTimer = setTimeout(() => {
            filter(lastFilterTitle, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast, $w('#iEmail').value);
        }, 200); 
    });   
    
    
    function filter(firstname, createFirst, createLast, updateFirst, updateLast, email) {
        console.log("run function");
        if (lastFilterTitle !== firstname || lastCreateFirst !== createFirst || lastCreateLast !== createLast || lastUpdateFirst !== updateFirst || lastUpdateLast !== updateLast || lastEmail !== email) {
            console.log("continue function");

            let newFilter = wixData.filter();
            if (firstname){
                newFilter = newFilter.contains('firstName', firstname);
=======
            filter($w('#IStudent').value, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast);
        }, 200);
    } );    
    
    
    function filter(company, createFirst, createLast, updateFirst, updateLast){
        if (lastFilterTitle !== company || lastCreateFirst !== createFirst || lastCreateLast !== createLast || lastUpdateFirst !== updateFirst || lastUpdateLast !== updateLast) {
            let newFilter = wixData.filter();
            if (company){
                newFilter = newFilter.contains('title', company);
>>>>>>> fd036174286879781cd665e353e4616dd726e56a
            }
            if (createFirst || createLast){
                newFilter = newFilter.between("_createdDate",createFirst, createLast);
            }
            if (updateFirst || updateLast){
                newFilter = newFilter.between("_updatedDate",updateFirst, updateLast);
            }
<<<<<<< HEAD
            console.log(email);
            if (email) {
                newFilter = newFilter.contains('title', email);
                console.log("email");
            }
=======
>>>>>>> fd036174286879781cd665e353e4616dd726e56a
            
            
            
            $w('#dataset1').setFilter(newFilter);
<<<<<<< HEAD
            lastFilterTitle = firstname;
=======
            lastFilterTitle = company;
>>>>>>> fd036174286879781cd665e353e4616dd726e56a
            lastCreateFirst = createFirst;
            lastCreateLast = createLast;
            lastUpdateFirst = updateFirst;
            lastUpdateLast = updateLast;
<<<<<<< HEAD
            lastEmail = email;
        }
    }


    $w("#repeater1").onItemReady(($w, itemData, index) => {
        $w("#matchInformation").onClick((event, $w) => {
            session.setItem("studentID", $w("#hiddenID").text);
            wixWindow.openLightbox("StudentMatches");
        });
      
    });
=======
        }
    }
    
>>>>>>> fd036174286879781cd665e353e4616dd726e56a

  
} );