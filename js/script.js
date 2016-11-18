	
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
        var target = OC.generateUrl('/apps/spreedboxlicensekeys/ajax/submit.php');

        $.ajax({
            type: "POST",
            url: target,
            data: json,
            dataType: "json"
        }).success(function(result) { 
            alert(result);
        }).fail(function() { 
            alert("Failed to submit request"); 
        });

        return true;
    });
});