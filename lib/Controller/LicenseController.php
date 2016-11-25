<?php
namespace OCA\SpreedboxLicenseKeys\Controller;

use OCP\AppFramework\Controller;

class LicenseController extends Controller {
    
    public function requestLicense($name, $company, $street, $zipcode, $city, $countrycode, $phonenumber, $mail_address, $mail_domain) {
        $array_data = array('name' => $name, 'company' => $company, 'street' => $street, 'zipcode' => $zipcode, 'city' => $city, 'countrycode' => $countrycode, 'phone' => $phonenumber, 'email' => $mail_address . '@' . $mail_domain);
        $json_data = json_encode($array_data, JSON_FORCE_OBJECT);
        $request = base64_encode($json_data);
        return array('request' => $request);
    }

    public function installLicense($license) {
        return array('saved' => 'true', 'filename' => 'path/to/');
    }
    
    public function listLicenses() {
        return array('license' => 'test license');
    }
}