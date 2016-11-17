	
function validateLicenseRequestForm() {
    var name = document.forms["licenserequestform"]["name"].value;
    if (name == "") {
        alert("Name must be filled out");
        return false;
    }
    
    var street = document.forms["licenserequestform"]["street"].value;
    if (street == "") {
        alert("Street must be filled out");
        return false;
    }
    
    var zipcode = document.forms["licenserequestform"]["zipcode"].value;
    if (zipcode == "") {
        alert("zipcode must be filled out");
        return false;
    }
    
    var city = document.forms["licenserequestform"]["city"].value;
    if (city == "") {
        alert("city must be filled out");
        return false;
    }
    
    var countrycode = document.forms["licenserequestform"]["countrycode"].value;
    if (countrycode == "") {
        alert("countrycode must be filled out");
        return false;
    }
    
    var mail_address = document.forms["licenserequestform"]["mail_address"].value;
    var mail_domain = document.forms["licenserequestform"]["mail_domain"].value;
    if (mail_address == "" || mail_domain == "") {
        alert("email address must be filled out");
        return false;
    }
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