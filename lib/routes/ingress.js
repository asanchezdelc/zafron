const express = require('express');
const Source = require('../db/models/source');
const Device = require('../db/models/device');
const router = new express.Router();
const Sink = require('../services/sink');
const decode = require('../decoder/decode');
const providers = ['ttnv3', 'chirpstack', 'helium'];

router.post('/:mask_id', async (req, res) => {
  const maskId = req.params.mask_id;
  const apiKey = req.header('x-api-key') || req.query.apiKey;
  try {
    if (!apiKey) {
      return res.status(400).send({ error: 'API Key is required' });
    }

    const source = await Source.findOne({ maskId: maskId });
    if (!source) {
      return res.status(404).send({ error: 'Source does not exists' });
    }
    console.log(source.name, source.provider, source.apiKey, apiKey);
    // validate api key
    if (source.apiKey !== apiKey) {
      return res.status(401).send({ error: 'Ingress Unauthorized' });
    }

    // get provider
    const provider = source.provider;
    if (!providers.includes(provider)) {
      return res.status(400).send({ error: 'Invalid provider' });
    }

    // response payload
    // validate JSON schema according to the provider

    // process payload
    const payload = req.body;
    // source.getDevEUI()
    const eui = payload.eui;
    // 
    const device = await Device.findOne({ serial: eui }).populate('owner profile');

    if (!device) {
      //if we return 404 here some network servers will keep retrying
      console.error('Device not found', eui, maskId);
      return res.status(200).send({ error: 'Device not found' });
    }

    // get device profile
    const profile = device.profile;

    if (!profile.decoder || profile.decoder === '') {
      console.error('Decoder not found', eui, maskId);
      return res.status(200).send({ error: 'Decoder not found' });
    }

    // The decoder attribute from the device profile holds the decoder function

    let decodedPayload = null;
    try {
      decodedPayload = decode(profile.decoder, payload);
    } catch (error) {
      console.error('Error decoding payload', eui, maskId, error);
      return res.status(500).send({ error: 'Error decoding payload' });
    }

    if (!decodedPayload) {
      console.error('Error decoding payload', eui, maskId);
      return res.status(200).send({ error: 'Error decoding payload' });
    }

    // verify decoded payload has an specific structure (JSONSchema?)

    // emit decoded payload
    console.log(decodedPayload);
    //
    const usr = device.owner ? device.owner.mqttCredentials : 'unknown';
    Sink.publish(usr.username, eui, JSON.stringify(decodedPayload));

    res.status(201).send({ ok: true });
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

module.exports = router;