<?php
/**
 *
 * @license GNU AGPL version 3 or any later version
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

?>

<div class="section" id="requestLicenseSection">
	<h2>Request License</h2>
    <form id="licenserequestform">
        <!--The name (string, required)-->
        <p>
            <label for="name">Name</label>
            <input type="text" name="name" id="name" placeholder="name" value="">
        </p>
        <!--The company (string, optional)-->
        <p>
            <label for="company">Company</label>
            <input type="text" name="company" id="company" placeholder="company" value="">
        </p>
        <!--The street (string, required)-->
        <p>
            <label for="street">Street</label>
            <input type="text" name="street" id="street" placeholder="street" value="">
        </p>
        <!--The zipcode and city (string, required)-->
        <p>
            <label for="street">Zipcode and City</label>
            <input type="text" name="zipcode" id="zipcode" placeholder="zipcode" value="">
            <input type="text" name="city" id="city" placeholder="city" value="">
        </p>
        <!--The two-letter country code (string, required)-->
        <p>
            <label for="countrycode">two-letter country code</label>
            <input type="text" name="countrycode" id="countrycode" placeholder="countrycode" value="">
        </p>
        <!--The phone number (string, optional)-->
        <p>
            <label for="phonenumber">phone number</label>
            <input type="text" name="phonenumber" id="phonenumber" placeholder="phonenumber" value="">
        </p>
        <!--The email address (string, required)-->
        <p>
            <label for="mail_from_address">Email address</label>
            <input type="text" name="mail_from_address" id="mail_from_address" placeholder="mail" value="">@
            <input type="text" name="mail_domain" id="mail_domain" placeholder="example.com" value="">
        </p>
        <input type="submit" name="requestlicense" id="requestlicense" value="Request License">
    </form>
    
    <br></br>
    
	<h2>Install License</h2>
    <form id="licenseinstallform">
        <!--The license (string, required)-->
        <p>
            <label for="license">License String</label>
            <input type="text" name="license" id="license" placeholder="license" value="">
        </p>
        <!--The license file(string, required)-->
        <p>
            <label for="licensefile">License File</label>
            <input type="file" name="licensefile" id="licensefile" placeholder="license file" value="">
        </p>
    </form>
    
    <br></br>
    
	<h2>Installed Licenses</h2>
    <button id="showlicenses">List Licenses</button>
</div>

