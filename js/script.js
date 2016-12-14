	
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

function ListFeatures(features, id) {
    $.each(features, function(key, val) {
        if (typeof val === "object") {
            $(id).append("<br>" + key + ": ");
            ListFeatures(val, id);
        }
        else {
            $(id).append("<br>" + key + ": " + val);
        }
    });
}

jQuery(document).on('ready', function() {
    jQuery('form#licenserequestform').bind('submit', function(event){
        event.preventDefault();
        
        if (!validateLicenseRequestForm()) {
            return false;
        }
        
        // feedback to the user to show we are performing the request as it can take several seconds
        $("#license_request_loading").show();
        
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
            
            $("#license_request_loading").hide();
            if (result.status == "success") {
                // pretty print in html
                var str = result.result.request;
                str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
                $("#request_instructions").show();
                $("#license_request").text(str);
            }
            else {
                $("#license_request").text("An error occured");
            }
        }).fail(function() { 
            $("#license_request_loading").hide();
            $("#license_request").text("Failed to submit request");
        });

        return true;
    });

    jQuery('form#licenseinstallform').bind('submit', function(event){
        event.preventDefault();
        
        var form = this;
        var json = ConvertFormToJSON(form);
        var target = OC.generateUrl('/apps/spreedboxlicensekeys/install_license');
    
        // feedback to the user to show we are performing the request as it can take several seconds
        $("#license_install_loading").show();
        $("#license_install").text("");
        
        $.ajax({
            type: "POST",
            url: target,
            data: JSON.stringify(json),
            dataType: "json",
            contentType: "application/json"
        }).success(function(result) { 
            $("#license_install_loading").hide();
            
            if (result.status == "success") {
                $("#license_install").text("Successfully installed license!");
            }
            else if (result.status == "error"){
                $("#license_install").text(result.message);
            }
            else {
                $("#license_install").text("Failed to install license!");
            }
        }).fail(function() { 
            $("#license_install_loading").hide();
            $("#license_install").text("Failed to submit request"); 
        });

        return true;
    });

    $("#showlicenses").click( function(event){
       
        var target = OC.generateUrl('/apps/spreedboxlicensekeys/list_licenses');

        $.ajax({
            type: "GET",
            url: target,
        }).success(function(result) { 
            // reset
            $("#license_content").text("");
            
            $.each(result.licenses, function(index, license) {
                var item = license.result;
                $("#license_content").append("<br><br>Valid: " + item.valid + "<br>Expires: " + item.expires + "<br>Features:");  
                ListFeatures(item.features, "#license_content");
            });
            
        }).fail(function() { 
            $("#license_content").text("Failed to submit request"); 
        });

        return true;
    });
    
    $("#copytoclipboard").click( function(event) {
        // Create a "hidden" input
        var aux = document.createElement("input");
        var str = document.getElementById("license_request").innerHTML;
        str = str.replace(/<br\s*[\/]?>/gi, '\n');
        
        // Assign it the value of the specified element
        aux.setAttribute("value", str);

        // Append it to the body
        document.body.appendChild(aux);

        // Highlight its content
        aux.select();

        // Copy the highlighted text
        document.execCommand("copy");

        // Remove it from the body
        document.body.removeChild(aux);
    });
    
    $('input[name=licensefile]').change(function() {

        var reader = new FileReader();
        reader.onload = function (e) {
            var textArea = document.getElementById("license");
            textArea.value = e.target.result;
        };
        var f = document.getElementById('licensefile').files[0];
        reader.readAsText(f);
    });
});

