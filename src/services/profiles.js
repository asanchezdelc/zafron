import { request } from './request';

const baseURL = "/api/profiles";

export const list = (page, limit) => {
  return request(`${baseURL}?page=${page}&limit=${limit}`);
};

export const create = (data) => {
  return request(`${baseURL}`, { method: 'POST', json: data, });
}

export const remove = (id) => {
  return request(`${baseURL}/${id}`, { method: 'DELETE' });
}

export const fetchOne = (id) => {
  return request(`${baseURL}/${id}`);
}

export const updateCode = (id, code) => {
  return request(`${baseURL}/${id}`, { method: 'PATCH', json: { decoder: code } });
}

export const update = (id, data) => {
  return request(`${baseURL}/${id}`, { method: 'PATCH', json: data });
}

export const decode = (id, data) => {
  return request(`${baseURL}/${id}/decode`, { method: 'POST', json: data });
}