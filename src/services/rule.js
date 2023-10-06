import { request } from './request';

const baseURL = "/api/rules";

export const list = (deviceId) => {
    return request(`${baseURL}?device_id=${deviceId}`);
};

export const getById = (id) => {
    return request(`${baseURL}/${id}`);
}

export const update = (id, rule) => {
    return request(`${baseURL}/${id}`, {
        method: 'PUT',
        json: rule,
    });
}

export const create = (rule) => {
  return request(`${baseURL}`, {
      method: 'POST',
      json: rule,
  });
}

export const remove = (id) => {
  return request(`${baseURL}/${id}`, {
      method: 'DELETE',
  });
}
