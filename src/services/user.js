const { request } = require('./request');
const baseURL = "/api/users";

export const getUserInfo = () => {
    return request(`${baseURL}/me`);
};

export const requestPasswordReset = (email) => {
    return request(`${baseURL}/reset-request`, {
        method: 'POST',
        json: {
          email
        }
    });
}

export const resetPassword = (token, password) => {
    return request(`${baseURL}/reset-password`, {
        method: 'POST',
        json: {
          password
        },
        token,
    });
}
