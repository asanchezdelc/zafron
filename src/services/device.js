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

export const getCapabilities = (deviceId) => {
  return request(`${baseURL}/${deviceId}/capabilities`);
}

export const patchDevice = (deviceId, payload) => {
  return request(`${baseURL}/${deviceId}`, {
      method: 'PATCH',
      json: payload
  });
};

export const fetchOne = (id) => {
  return request(`${baseURL}/${id}`);
};

export const fetchReadings = (id, page, limit, startDate, endDate) => {
  const _baseUrl = `${baseURL}/${id}/measurements?page=${page}&limit=${limit}`;
  if (startDate && endDate) {
    return request(`${_baseUrl}&startDate=${startDate}&endDate=${endDate}`);
  }
  return request(`${_baseUrl}`);
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

