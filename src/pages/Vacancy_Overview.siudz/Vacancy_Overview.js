import wixLocation from "wix-location";
import {session} from 'wix-storage';
import wixData from 'wix-data';
import wixUsers from 'wix-users';



$w.onReady( () => {
  $w("#dataset1").onReady( () => {
    let user = wixUsers.currentUser;
    let userId = user.id;

    let newFilter = wixData.filter();
    newFilter = newFilter.hasSome('CompanyAccountsInfo-1', userId);
    $w('#dataset1').setFilter(newFilter);

    $w("#repeater1").onItemReady( ($item, itemData, index) => {
      let theItem = itemData.jobDescription;
      var shortDescription = theItem.substr(0,150);
      $item("#description").text = shortDescription + "...";
    });

  } );
  
$w("#vectorImage2").onClick( (event, $w) => {
  session.setItem("vacancyID", $w("#hiddenid").text);
  
  session.setItem("Lastlocation", ("/vacancy-overview"));  
  // console.log( $w("#hiddenid").text);  
  wixLocation.to("/editing-vacancy");
} );
} );