# nextcloud-spreedbox-license-keys

This repository contains a Nextcloud app that can be used to manage the
additional software license keys of a Spreedbox

License keys are bound to the hardware, so they have to be requested from the
Spreedbox where they will be used later.


## Features

The following features are available through the app:

- Request a new license
- Install a license
- List installed licenses


## Request a new license

To request a license, some information about the user have to be given:

- The name (string, required)
- The company (string, optional)
- The street (string, required)
- The zipcode and city (string, required)
- The two-letter country code (string, required)
- The phone number (string, optional)
- The email address (string, required)

The app will send this data to the backend service (see below) which will
generate a license request (string). This license request must then be sent to
us, will be updated to contain information about the available features, will
be signed and returned to the requester.

Afterwards, the license can be installed and the included features will be
enabled on the Spreedbox.


## Install a license

The app provides a way to either upload the license file or to paste the license
text in some field to install it.

The license data is sent to the backend service (see below) which will verify
the license, check if it is valid for the current hardware and then install it
in the system.


## List installed licenses

The app provides an overview to list all installed licenses and also shows the
available features.


## Backend service

As the Nextcloud app runs with limited permissions (i.e. under the webserver
user) but installing and activating licenses requires `root` permissions, a
backend service must be used to perform all license-related actions.

This is to be defined.
