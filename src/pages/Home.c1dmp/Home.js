import {getScore} from 'backend/model';
import wixData from 'wix-data';
import {updatePermissions} from 'public/permission';

$w.onReady(async function () {

    updatePermissions();

});
