	
var REQUEST_HEADER = '-----BEGIN LICENSE REQUEST-----\n';
var REQUEST_FOOTER = '-----END LICENSE REQUEST-----\n';

function validateLicenseRequestForm() {
    var ret = true;
    
    var name = document.forms["licenserequestform"]["name"].value;
    if (name == "") {
        $("#name_error").css("visibility", "visible");
        ret = false;
    }
    else {
        $("#name_error").css("visibility", "hidden");
    }
    
    var street = document.forms["licenserequestform"]["street"].value;
    if (street == "") {
        $("#street_error").css("visibility", "visible");
        ret = false;
    }
    else {
        $("#street_error").css("visibility", "hidden");
    }
    
    var zipcode = document.forms["licenserequestform"]["zipcode"].value;
    if (zipcode == "") {
        $("#zipcode_error").css("visibility", "visible");
        ret = false;
    }
    else {
        $("#zipcode_error").css("visibility", "hidden");
    }
    
    var city = document.forms["licenserequestform"]["city"].value;
    if (city == "") {
        $("#city_error").css("visibility", "visible");
        ret = false;
    }
    else {
        $("#city_error").css("visibility", "hidden");
    }
    
    var countrycode = document.forms["licenserequestform"]["countrycode"].value;
    if (countrycode == "") {
        $("#countrycode_error").css("visibility", "visible");
        ret = false;
    }
    else {
        $("#countrycode_error").css("visibility", "hidden");
    }
    
    var mail_address = document.forms["licenserequestform"]["mail_address"].value;
    var mail_domain = document.forms["licenserequestform"]["mail_domain"].value;
    if (mail_address == "" || mail_domain == "") {
        $("#mail_address_error").css("visibility", "visible");
        ret = false;
    }
    else {
        $("#mail_address_error").css("visibility", "hidden");
    }
    
    return ret;
}

function ConvertFormToJSON(form){
    var array = jQuery(form).serializeArray();
    var json = {};
    
    jQuery.each(array, function() {
        json[this.name] = this.value || '';
    });
    
    return json;
}

jQuery(document).on('ready', function() {
    jQuery('form#licenserequestform').bind('submit', function(event){
        event.preventDefault();
        
        if (!validateLicenseRequestForm()) {
            return false;
        }
        
        var form = this;
        var json = ConvertFormToJSON(form);
        var target = OC.generateUrl('/apps/spreedboxlicensekeys/request_license');

        $.ajax({
            type: "POST",
            url: target,
            data: JSON.stringify(json),
            dataType: "json",
            contentType: "application/json"
        }).success(function(result) { 
            
            if (result.status == "success") {
                // pretty print in html
                var str = result.result.request;
                str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
                document.getElementById("license_request").innerHTML = str;
            }
            else {
                document.getElementById("license_request").innerHTML = "An error occured";
            }
        }).fail(function() { 
            alert("Failed to submit request"); 
        });

        return true;
    });

    jQuery('form#licenseinstallform').bind('submit', function(event){
        event.preventDefault();
        
        var form = this;
        var json = ConvertFormToJSON(form);
        var target = OC.generateUrl('/apps/spreedboxlicensekeys/install_license');

        $.ajax({
            type: "POST",
            url: target,
            data: JSON.stringify(json),
            dataType: "json",
            contentType: "application/json"
        }).success(function(result) { 
            alert(JSON.stringify(result));
        }).fail(function() { 
            alert("Failed to submit request"); 
        });

        return true;
    });

    $("#showlicenses").click( function(event){
       
        var target = OC.generateUrl('/apps/spreedboxlicensekeys/list_licenses');

        $.ajax({
            type: "GET",
            url: target,
        }).success(function(result) { 
            document.getElementById("license_content").innerHTML = "<p>" + "License Content: " + JSON.stringify(result);
        }).fail(function() { 
            alert("Failed to submit request"); 
        });

        return true;
    });
});