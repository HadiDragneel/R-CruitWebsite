import wixUsers from 'wix-users';
import wixLocation from 'wix-location';

$w.onReady(function(){
    $w('#LoginSubmit').onClick(function(){
        let email = $w('#LoginEmail').value;
        let password = $w('#LoginPassword').value;
        wixUsers.login(email,password)
        .then(()=>{
            wixLocation.to('/home');
        })
        .catch((err) => {
            let errorMsg = err;
            $w("#text76").text = "The given email and password combination does not exist.";
            $w("#text76").show();
        });
    })
})

$w('#ForgotPasswordButton').onClick(function(){
    wixUsers.promptForgotPassword();
    })