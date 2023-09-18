const baseURL = "/api/devices";

const getToken = () => {
    return localStorage.getItem('jwt'); 
};

const request = async (url, options = {}) => {
    // Default headers
    const headers = {
        'Authorization': `Bearer ${getToken()}`
    };

    if (options.json) {
        headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(options.json);
        delete options.json;
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Request failed");
    }

    console.log(response)

    return response.json();
};

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
  return request(`${baseURL}/${id}/metrics/${channel}`);
}
