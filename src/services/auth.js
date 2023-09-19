import jwt_decode from "jwt-decode";

class AuthService {
  isAuthenticated () {
    const tokens = localStorage.getItem('jwt');
    let isAuthenticated = false;
    if (tokens !== "") {
      //const jsonToken = JSON.parse(tokens);
      isAuthenticated = tokens && jwt_decode(tokens).exp > Date.now() / 1000;
    }
    return isAuthenticated;
  }
}

export default AuthService;
