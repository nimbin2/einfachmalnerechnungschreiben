import axios from 'axios';
import history from "../history";

class AxiosHelper {
    static init() {
        axios.interceptors.request.use((config) => {
            let token = localStorage.getItem('bearertoken');

            if (token) {
                config.headers.common['authorization'] = `Bearer ${token}`
            }
            config.validateStatus = function(status) {
                return (status >= 200 && status < 300) || status === 404
            };
            return config;
        });

        axios.interceptors.response.use(null, function (error) {
            if (error.response && [401, 403].includes(error.response.status)) {
                localStorage.removeItem("bearertoken");
                history.push("/login")
                window.loadScreen = null;
            } //else {
                //alert("please contact somebody")
            //}

            return Promise.reject(error);
        });
    }
}

export default AxiosHelper;
