#!/usr/bin/python -u
##
## Sample script to implement a client using the JSON interface of the
## "spreedbox-license-keys" commandline tool.
##
import base64
import binascii
import json
from optparse import OptionParser
import os
import sys

REQUEST_HEADER = '-----BEGIN LICENSE REQUEST-----\n'
REQUEST_FOOTER = '-----END LICENSE REQUEST-----\n'

EXAMPLE_FEATURES = {
  'sip': {
    'endpoints': 5,
    'room-calls': 6,
    'total-calls': 10,
  },
}

def return_error(msgid, message, returncode=1):
  msg = {
    'status': 'error',
    'msgid': msgid,
    'message': message,
  }
  print json.dumps(msg, sort_keys=True, indent=4)
  return returncode

def return_success(result):
  msg = {
    'status': 'success',
    'result': result,
  }
  print json.dumps(msg, sort_keys=True, indent=4)

def encode_request(data):
  """Very simple encoding of request data to match format of real app."""
  request = json.dumps({
    'data': data,
  }, indent=0, separators=(',',':'), sort_keys=True)
  request = base64.encodestring(request)
  return REQUEST_HEADER + request + REQUEST_FOOTER

def decode_request(data):
  """Decode data created from "encode_request"."""
  if not isinstance(data, basestring):
    return None

  lines = [x + '\n' for x in data.split('\n')]
  try:
    start = lines.index(REQUEST_HEADER)
  except ValueError:
    return None

  try:
    end = lines.index(REQUEST_FOOTER, start + 1)
  except ValueError:
    return None

  try:
    decoded = base64.decodestring(''.join(lines[start + 1:end]))
  except binascii.Error:
    return None

  try:
    request = json.loads(decoded)
  except ValueError:
    return None

  return request['data']

def run_request(*args):
  try:
    data = json.load(sys.stdin)
  except ValueError:
    return return_error('invalid_json', 'Could not parse JSON input.',
        returncode=4)

  known_keys = (
    ('name', True),
    ('company', False),
    ('street', True),
    ('zipcode_city', True),
    ('country_code', True),
    ('phone', False),
    ('email', True),
  )
  request = {}
  for (key, required) in known_keys:
    value = data.get(key, None)
    if required and not value:
      return return_error('missing_' + key,
          'Required parameter ' + key + ' is empty or missing.', returncode=4)

    if key == 'country_code':
      if len(value) != 2:
        return return_error('invalid_country_code',
            'The country code must contain exactly two letters.', returncode=4)
    elif key == 'email':
      if not '@' in value:
        return return_error('invalid_email', 'Invalid email address format.',
            returncode=4)

    if value:
      request[key] = value

  return return_success({
    'request': encode_request(request),
  })

def run_validate(*args):
  try:
    data = json.load(sys.stdin)
  except ValueError:
    return return_error('invalid_json', 'Could not parse JSON input.',
        returncode=4)

  license = data.get('license', None)
  if not license:
    return return_error('missing_license',
        'Required parameter license is empty or missing.', returncode=4)

  request = decode_request(license)
  if not request:
    return return_error('invalid_license', 'the format is not valid')

  return_success({
    'valid': True,
    'features': [
      EXAMPLE_FEATURES,
    ],
  })

def run_install(*args):
  try:
    data = json.load(sys.stdin)
  except ValueError:
    return return_error('invalid_json', 'Could not parse JSON input.',
        returncode=4)

  license = data.get('license', None)
  if not license:
    return return_error('missing_license',
        'Required parameter license is empty or missing.', returncode=4)

  name = data.get('name', None)
  if not name:
    return return_error('missing_name',
        'Required parameter name is empty or missing.', returncode=4)

  request = decode_request(license)
  if not request:
    return return_error('invalid_license', 'the format is not valid')

  return_success({
    'saved': True,
    'filename': os.path.join('/path/to', name),
  })

COMMANDS = {
  'request': run_request,
  'validate': run_validate,
  'install': run_install,
}

def main():
  parser = OptionParser(usage = 'Usage: %prog [options] <command> [arguments]')
  parser.add_option('--json', action='store_true', dest='json', default=False,
                    help='Use JSON data as input/output.')
  (options, args) = parser.parse_args()
  if not args:
    parser.error('No command given.')

  if not options.json:
    parser.error('Only the JSON mode is supported.')

  command = COMMANDS.get(args[0], None)
  if command is None:
    parser.error('Unknown command given.')

  return command(*args[1:])

if __name__ == '__main__':
  sys.exit(main())
