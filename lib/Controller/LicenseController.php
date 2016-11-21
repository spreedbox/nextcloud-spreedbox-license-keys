<?php
namespace OCA\SpreedboxLicenseKeys\Controller;

use OCP\AppFramework\Controller;

class LicenseController extends Controller {

    public function requestLicense($name, $company, $street, $zipcode, $city, $countrycode, $phonenumber, $mail_address, $mail_domain) {
        return array('name' => $name);
    }

    public function installLicense($license) {
    
    }
    
    public function listLicenses() {
        return array('license' => 'test license');
    }
}