<?php
namespace OCA\SpreedboxLicenseKeys\Controller;

use OCP\AppFramework\Controller;

class LicenseController extends Controller {
    
    private function runCommand($cmd, $data) {
        $descriptorspec = array(
           0 => array("pipe", "r"),  // stdin is a pipe that the child will read from
           1 => array("pipe", "w"),  // stdout is a pipe that the child will write to
        );

        $process = proc_open($cmd, $descriptorspec, $pipes);

        if (is_resource($process)) {
            // $pipes now looks like this:
            // 0 => writeable handle connected to child stdin
            // 1 => readable handle connected to child stdout

            fwrite($pipes[0], $data); 
            fclose($pipes[0]);

            $out_content = stream_get_contents($pipes[1]);
            fclose($pipes[1]);

            // It is important that you close any pipes before calling
            // proc_close in order to avoid a deadlock
            $return_value = proc_close($process);

            return $out_content;
        }
        
        return "could not open process";
    }
    
    public function requestLicense($name, $company, $street, $zipcode, $city, $countrycode, $phonenumber, $mail_address, $mail_domain) {
        $array_data = array('name' => $name, 'company' => $company, 'street' => $street, 'zipcode_city' => $zipcode . $city, 'country_code' => $countrycode, 'phone' => $phonenumber, 'email' => $mail_address . '@' . $mail_domain);
        $json_data = json_encode($array_data, JSON_FORCE_OBJECT);
        
        $request = $this->runCommand('spreedbox-license-keys --json request', $json_data);
        
        return json_decode($request, TRUE);
    }

    public function installLicense($license) {
        $temp = tmpfile();
        fwrite($temp, $license);
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