import wixData from "wix-data";
import {session} from 'wix-storage';
import wixLocation from "wix-location";


$w.onReady( () => {
  $w("#dataset1").onReady( () => {

    $w("#repeater1").onItemReady( ($item, itemData, index) => {
      let theItem = itemData.jobDescription;
      var shortDescription = theItem.substr(0,150);
      $item("#description").text = shortDescription + "...";
    });

  } );
    
  
    
    
    
    
    let debounceTimer;
    let lastFilterTitle;
    let lastCreateFirst;
    let lastCreateLast;
    let lastUpdateFirst;
    let lastUpdateLast;
    
    

$w("#datePicker1").onChange( (event) => {  
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
  });
    
    
  $w("#iCompany").onKeyPress( (event) => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
          debounceTimer = undefined;
      }
      
        debounceTimer = setTimeout(() => {
            filter($w('#iCompany').value, $w('#datePicker1').value, $w('#datePicker2').value, lastUpdateFirst, lastUpdateLast);
        }, 200);
    } );    
    
    
    function filter(company, createFirst, createLast, updateFirst, updateLast){
        if (lastFilterTitle !== company || lastCreateFirst !== createFirst || lastCreateLast !== createLast || lastUpdateFirst !== updateFirst || lastUpdateLast !== updateLast) {
            let newFilter = wixData.filter();
            if (company){
                newFilter = newFilter.contains('title', company);
            }
            if (createFirst || createLast){
                newFilter = newFilter.between("_createdDate",createFirst, createLast);
            }
            if (updateFirst || updateLast){
                newFilter = newFilter.between("_updatedDate",updateFirst, updateLast);
            }
            
            
            
            $w('#dataset1').setFilter(newFilter);
            lastFilterTitle = company;
            lastCreateFirst = createFirst;
            lastCreateLast = createLast;
            lastUpdateFirst = updateFirst;
            lastUpdateLast = updateLast;
        }
    }
    

    $w("#vectorImage2").onClick( (event, $w) => {
      session.setItem("vacancyID", $w("#hiddenid").text);
      // console.log( $w("#hiddenid").text);
      session.setItem("Lastlocation", "/copy-of-vacancy-overview");  
      wixLocation.to("/editing-vacancy");
    } );
} );