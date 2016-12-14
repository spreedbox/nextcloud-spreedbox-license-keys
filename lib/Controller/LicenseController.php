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
    
    private function rec_listFiles( $from = '.')
    {
        if(! is_dir($from))
            return false;
        
        $files = array();
        if( $dh = opendir($from))
        {
            while( false !== ($file = readdir($dh)))
            {
                // Skip '.' and '..'
                if( $file == '.' || $file == '..')
                    continue;
                $path = $from . '/' . $file;
                if( is_dir($path) )
                    $files += rec_listFiles($path);
                else
                    $files[] = $path;
            }
            closedir($dh);
        }
        return $files;
    }
    
    public function requestLicense($name, $company, $street, $zipcode, $city, $countrycode, $phonenumber, $mail_address, $mail_domain) {
        $array_data = array('name' => $name, 'company' => $company, 'street' => $street, 'zipcode_city' => $zipcode . $city, 'country_code' => $countrycode, 'phone' => $phonenumber, 'email' => $mail_address . '@' . $mail_domain);
        $json_data = json_encode($array_data, JSON_FORCE_OBJECT);
        
        $request = $this->runCommand('spreedbox-license-keys --json request', $json_data);
        
        return json_decode($request, TRUE);
    }

    public function installLicense($license) {
        // using current date and time for filename
        $name='license_'.date('m-d-Y_hia').'.txt';
        
        $array_data = array('license' => $license, 'name' => $name);
        $json_data = json_encode($array_data, JSON_FORCE_OBJECT);
        
        $request = $this->runCommand('spreedbox-license-keys --json install', $json_data);
        
        return json_decode($request, TRUE);
    }
    
    public function listLicenses() {
        $dir = "/etc/spreedbox/licenses/";

        $files = $this->rec_listFiles($dir);
       
        $response = array();
        
        foreach ($files as $file) {
            $license = file_get_contents($file);
            $array_data = array('license' => $license, 'name' => $file);
            $json_data = json_encode($array_data, JSON_FORCE_OBJECT);
            $validation = $this->runCommand('spreedbox-license-keys --json validate ', $json_data) ;
            array_push($response, json_decode($validation));
        }
        
        return array('licenses' => $response);
    }
}
?>