
import axios from 'axios';

export default class ApiHandler {
    constructor(url) {
        this.axios = axios;
        this.apiurl = url;
        this.config = {
            headers: {
                'Cache-Control': 'no-cache',
                'Content-Type': 'application/json'
            }
        };
    }
    load(url, data) {
        console.log('ApiHandler: load');
        console.log(data);
        let formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
            formData.append(key, value);
        }
        return new Promise((resolve, reject) => {
            this.axios.post(this.apiurl + url, formData)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        resolve(response.data);
                    } else {
                        reject('response.status: ' + response.status);
                    }
                })
                .catch((err) => {
                    reject('internal error: ' + err);
                });
        });
    }
    json(url, data) {
        console.log('ApiHandler: json');
        console.log(data);
        let formData = JSON.stringify(data);
        return new Promise((resolve, reject) => {
            this.axios.post(this.apiurl + url, formData)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        resolve(response.data);
                    } else {
                        reject('response.status: ' + response.status);
                    }
                })
                .catch((err) => {
                    reject('internal error: ' + err);
                });
        });
    }
    get(url) {
        return new Promise((resolve, reject) => {
            this.axios.get(this.apiurl + url)
                .then((response) => {
                    if (response.status === 200 && response.data) {
                        resolve(response.data);
                    } else {
                        reject('response.status: ' + response.status);
                    }
                })
                .catch((err) => {
                    reject('internal error: ' + err);
                });
        });
    }
    getCookieByName(name) {
        var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        if (match) return match[2];
        return '';
    }
}