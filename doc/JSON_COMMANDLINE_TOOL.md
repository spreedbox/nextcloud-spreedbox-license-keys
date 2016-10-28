# spreedbox-license-keys JSON API

In some cases the license management functionality must be integrated into third
party services written in incompatible programming languages or that can't use
the library code due to incompatible licenses.

For these cases, the commandline tool provides a basic JSON interface for all
operations, so the input data can be passed through `stdin` and the result (or
an error) is reported on `stdout`.

To enable the JSON mode, the commandline parameter `--json` must be passed.


## Responses

If a command was executed successfully, the returncode will be `0` and a JSON
document is printed on `stdout` containing the key `status` with value `success`
and a key `result` with the result of the command.

If an error occurred, the returncode will be non-zero and a JSON document is
printed on `stdout` containing the key `status` with the value `error`, the
key `msgid` with the id of the error and the key `message` with a human-readable
error message.


## Requesting a license

    $ spreedbox-license-keys request --json < input.json


The input JSON data must contain the following keys:

- `name`: The name to request a license for (string, required).
- `company`: The company (string, optional).
- `street`: The street (string, required).
- `zipcode_city`: The zip code and city (string, required).
- `country_code`: The ISO 3166-1 alpha-2 country code (two-letter string,
  required). See https://en.wikipedia.org/wiki/ISO_3166-1_alpha-2 for details.
- `phone`: The phone number (string, optional).
- `email`: The email address (string, required).


On success the `result` will contain the key `request` with the license request
data which then must be sent to licences@struktur.de for further processing.


Example:

    $ cat request.json
    {
      "name": "John Doe",
      "company": "ACME Ltd.",
      "street": "123 Main St.",
      "zipcode_city": "Anytown",
      "country_code": "us",
      "phone": "+1234567890"
      "email": "user@domain.invalid"
    }

    $ spreedbox-license-keys request --json < request.json
    {
       "result" : {
          "request" : "-----BEGIN LICENSE REQUEST-----\nMIID.....dwqIe\n-----END LICENSE REQUEST-----\n"
       },
       "status" : "success"
    }


## Validating a license

    $ spreedbox-license-keys validate --json < input.json


The input JSON data must contain the following keys:

- `license`: The license data (string, required).


On success the `result` will contain the key `valid` with value `true`, a key
`expires` with the timestamp when the license will expire and a key `features`
with additional information about features this license will enable.


Example:

    $ cat request.json
    {
      "name": "sample-license.txt",
      "license": "-----BEGIN LICENSE-----\nMIIF...q5KzeY=\n-----END LICENSE-----"
    }

    $ spreedbox-license-keys validate --json < request.json
    {
       "result" : {
          "expires" : "21160721135455Z",
          "features" : {
            "sip" : {
              "endpoints" : 5,
              "room-calls" : 6,
              "total-calls" : 10
            }
          },
          "valid" : true
       },
       "status" : "success"
    }


## Installing a license

    $ spreedbox-license-keys install --json < input.json


The input JSON data must contain the following keys:

- `license`: The license data (string, required).
- `name`: The name to save the license as (string, required).

The `name` will be used to construct the filename to save the license as, so it
must be unique.


On success the `result` will contain the key `saved` with value `true` and a key
`filename` with the absolute filename the license has been saved as.


Example:

    $ cat request.json
    {
      "name": "sample-license.txt",
      "license": "-----BEGIN LICENSE-----\nMIIF...q5KzeY=\n-----END LICENSE-----"
    }

    $ spreedbox-license-keys install --json < request.json
    {
       "result" : {
          "filename" : "/path/to/sample-license.txt",
          "saved" : true
       },
       "status" : "success"
    }


## Testing

To test the JSON interface without having the `spreedbox-license-keys` tool,
the (very basic) script `sample-json-cli.py` can be used. It has the same API
as the `spreedbox-license-keys` tool but only supports the JSON interface.

The data returned as license request can be used as license data to validate
or install.
