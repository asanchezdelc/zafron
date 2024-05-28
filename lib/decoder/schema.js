const Validator = require('jsonschema').Validator;

const outputSchema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Decoder output schema",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "channel": {
        "type": "string"
      },
      "type": {
        "type": "string"
      },
      "value": {
        "type": "number"
      },
      "unit": {
        "type": "string"
      }
    },
    "required": [
      "channel",
      "type",
      "value",
      "unit"
    ]
  }
};

const validate = (data) => {
  const v = new Validator();
  return v.validate(data, outputSchema);
}

module.exports = { validate }