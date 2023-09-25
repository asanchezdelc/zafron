const baseURL = "/api/users";

const getToken = () => {
    return localStorage.getItem('jwt'); 
};

const request = async (url, options = {}) => {
    let token = getToken();
    if (options.token) {
        token = options.token;
    }
    // Default headers
    const headers = {
        'Authorization': `Bearer ${token}`
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

    return response.json();
};

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
