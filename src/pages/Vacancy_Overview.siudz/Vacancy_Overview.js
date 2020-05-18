$w.onReady( () => {
  $w("#dataset1").onReady( () => {

    $w("#repeater1").onItemReady( ($item, itemData, index) => {
      let theItem = itemData.jobDescription;
      var shortDescription = theItem.substr(0,150);
      $item("#description").text = shortDescription + "...";
    });

  } );
  
} );