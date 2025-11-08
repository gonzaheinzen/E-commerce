
//clase que va a manejar las peticiones HTTP
export class HttpFetch {

    constructor(url) {
        this.url = url;
    }

    async get() {
        let resp = await fetch(this.url);
        let data = await resp.json();
        return data;
    }

    async post(data) {
        let resp = await fetch(this.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseData = await resp.json();
        return responseData;
    }

    async put(data) {
        let resp = await fetch(this.url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        let responseData = await resp.json();
        return responseData;
    }

    async delete() {
        let resp = await fetch(this.url, {
            method: 'DELETE'
        });
        let responseData = await resp.json();
        return responseData;
    }


}