	
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

function ListFeatures(features) {
    var retVal = "";
    var headers = [];
    var values = [];
    
    $.each(features, function(key, val) {
        
        if (typeof val === "object") {
            retVal += "<section><header class=\"features_heading\">" + key + "</header><br><table>";
            retVal += ListFeatures(val) + "</table></section>";
        }
        else {
            headers.push(key);
            values.push(val);
        }
    });
    
    // add table headers
    retVal += "<tr>";
    $.each(headers, function(index, val) {
        retVal += "<th>" + val + "</th>";
    });
    retVal += "</tr>";
    
    // add table values
    retVal += "<tr>";
    $.each(values, function(index, val) {
        retVal += "<td>" + val + "</td>";
    });
    retVal += "</tr>";
    
    return retVal;
}

function ParseDate(date) {
    var retVal = "<span ";
    var momentObj = moment(date, "YYYYMMDDHHmmssZ");
    var formatted = OC.Util.formatDate(momentObj);

    
    var now = new Date();
    if (!momentObj.isAfter(now)) {
        // selected date is in the past
        retVal += "class=\"expired\">";
    }
    else {
        retVal += "class=\"valid\">";
    }
    
    retVal += formatted;
    retVal += "</span>";
    return retVal;
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
                var featuresContent = "<br><br><div class=\"license_item\"><article class=\"features\">";
                featuresContent += ListFeatures(item.features);
                featuresContent += "</article><br>Valid: " + item.valid + "<br>Expires: " + ParseDate(item.expires) + "</div>";
                $("#license_content").append(featuresContent);  
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

