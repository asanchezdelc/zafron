import { request } from './request';

const baseURL = "/api/sources";

export const list = (page, limit) => {
  return request(`${baseURL}?page=${page}&limit=${limit}`);
};

export const create = (data) => {
  return request(`${baseURL}`, { method: 'POST', json: data, });
}

export const remove = (id) => {
  return request(`${baseURL}/${id}`, { method: 'DELETE' });
}

export const findOne = (id) => {
  return request(`${baseURL}/${id}`);
}