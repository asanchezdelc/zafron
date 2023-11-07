
const getToken = () => {
    return localStorage.getItem('jwt'); 
};

export const request = async (url, options = {}) => {
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
        console.log(response)
        const data = await response.json();
        throw new Error(data.error || "Request failed");
    }

    return response.json();
};