const { request } = require('./request');

const baseURL = "/api/devices";

export const fetchDevices = () => {
    return request(baseURL);
};

export const addDevice = (device) => {
    return request(baseURL, {
        method: 'POST',
        json: device
    });
};

export const removeDevice = (deviceId) => {
    return request(`${baseURL}/${deviceId}`, {
        method: 'DELETE'
    });
};

export const patchCapability = (deviceId, capability) => {
  return request(`${baseURL}/${deviceId}/capabilities?action=remove`, {
      method: 'PATCH',
      json: { capability: capability }
  });
};

export const patchDevice = (deviceId, payload) => {
  return request(`${baseURL}/${deviceId}`, {
      method: 'PATCH',
      json: payload
  });
};

export const fetchOne = (id) => {
  return request(`${baseURL}/${id}`);
};

export const fetchReadings = (id, page, limit) => {
  return request(`${baseURL}/${id}/measurements?page=${page}&limit=${limit}`);
}

export const fetchHistogram = (id) => {
  return request(`${baseURL}/${id}/histogram`);
}

export const fetchLatest = (id) => {
  return request(`${baseURL}/${id}/latest`);
}

export const fetchMetric = (id, channel) => {
  return request(`${baseURL}/${id}/measurements/${channel}`);
}

