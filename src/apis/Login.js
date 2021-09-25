import axios from 'axios';
import Config from '../config/Config';

class Login {
    static authenticate(username, password) {
        return axios.post(`${Config.api()}login`, {
            username: username,
            password: password
        })
    }
    static register(username, password) {
        return axios.post(`${Config.api()}user/register`, {
            username: username,
            password: password
        })
    }
}

export default Login;
