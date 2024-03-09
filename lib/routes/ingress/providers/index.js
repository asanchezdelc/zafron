const providers = {
  'ttnv3': (body) => {
    return {
      devEUI: body.end_device_ids.dev_eui,
      payload: body.uplink_message.frm_payload
    };
  },
  'chirpstack': (body) => {
    // return the required fields from the chirpstack body
  },
  'helium': (body) => {
    // return the required fields from the helium body
  }
};

const extractFields = (provider, body) => {
  if (providers[provider]) {
    return providers[provider](body);
  } else {
    throw new Error(`Provider ${provider} not supported`);
  }
};

module.exports = { extractFields, providers };