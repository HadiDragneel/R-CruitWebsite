import { logout } from "wix-users"

$w.onReady(function() {
    $w("#LogoutButton").onClick(logout);
})