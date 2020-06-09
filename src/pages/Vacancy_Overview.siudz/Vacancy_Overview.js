import wixLocation from "wix-location";
import {session} from 'wix-storage';
import wixData from 'wix-data';




$w.onReady( () => {
  $w("#dataset1").onReady( () => {

    $w("#repeater1").onItemReady( ($item, itemData, index) => {
      let theItem = itemData.jobDescription;
      var shortDescription = theItem.substr(0,150);
      $item("#description").text = shortDescription + "...";
    });

  } );
  
$w("#vectorImage2").onClick( (event, $w) => {
  session.setItem("vacancyID", $w("#hiddenid").text);
  // console.log( $w("#hiddenid").text);  
  wixLocation.to("/editing-vacancy");
} );
} );