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
    })
})