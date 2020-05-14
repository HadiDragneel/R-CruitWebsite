import wixUsers from 'wix-users';
import wixData from 'wix-data';
import wixLocation from 'wix-location';


$w('#forgotPasswordButton').onClick(function () {
  wixUsers.promptForgotPassword();
})

$w.onReady( () => {
  if(wixUsers.currentUser.loggedIn) {
    $w("#loginButton").label = "Logout";
  }
  else {
    $w("#loginButton").label = "Login";
  }
} );

export function loginButton_click(event) { 
  // user is logged in
  if(wixUsers.currentUser.loggedIn) {
    // log the user out
    wixUsers.logout()
      .then( () => {
        // update buttons accordingly
        $w("#loginButton").label = "Login";
    } );
  }
  // user is logged out
  else {
    let userId;
    let userEmail;
  
    // prompt the user to log in 
    wixUsers.promptLogin( {"mode": "login"} )
      .then( (user) => {
        userId = user.id;
        return user.getEmail();
      } )
      .then( (email) => {
        // check if there is an item for the user in the collection
        userEmail = email;
        return wixData.query("Members")
          .eq("_id", userId)
          .find();
      } )
      .then( (results) => {
        // if an item for the user is not found
        if (results.items.length === 0) {
          // create an item
          const toInsert = {
            "_id": userId,
            "email": userEmail
          };
          // add the item to the collection
          wixData.insert("Members", toInsert)
            .catch( (err) => {
              console.log(err);
            } );
        }
        // update buttons accordingly
        $w("#loginButton").label = "Logout";
      } )
      .catch( (err) => {
        console.log(err);
      } );
  }
}
