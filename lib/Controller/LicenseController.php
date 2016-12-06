<?php
namespace OCA\SpreedboxLicenseKeys\Controller;

use OCP\AppFramework\Controller;

class LicenseController extends Controller {
    
    public function requestLicense($name, $company, $street, $zipcode, $city, $countrycode, $phonenumber, $mail_address, $mail_domain) {
        $array_data = array('name' => $name, 'company' => $company, 'street' => $street, 'zipcode_city' => $zipcode . $city, 'country_code' => $countrycode, 'phone' => $phonenumber, 'email' => $mail_address . '@' . $mail_domain);
        $json_data = json_encode($array_data, JSON_FORCE_OBJECT);
        
        $temp = tmpfile();
        fwrite($temp, $json_data);
        $metaDatas = stream_get_meta_data($temp);
        $tmpFilename = $metaDatas['uri'];
        
        exec( 'cat ' . $tmpFilename . ' | spreedbox-license-keys --json request', $request) ;
        
        fclose($temp); // this removes the file
        
        return json_decode(implode($request), TRUE);
    }

    public function installLicense($license) {
        $temp = tmpfile();
        fwrite($temp, $json_data);
        $metaDatas = stream_get_meta_data($temp);
        $tmpFilename = $metaDatas['uri'];
        
        exec( 'spreedbox-license-keys install ' . $tmpFilename, $request) ;
        
        fclose($temp); // this removes the file
        return array('result' => implode($request));
    }
    
    public function listLicenses() {
        exec( 'ls /etc/spreedbox/licenses/', $request);
        return array('license' => $request);
    }
}
?>