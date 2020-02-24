export default function ajax(url, 
    options = {method: 'GET', headers: {}, body: null}, 
    callbacks= {onsuccess: () => {}, onerror: () => {}, oncomplete: () => {} }) {
    const xhr = new XMLHttpRequest();
    xhr.open(options.method, url);
    if (options.headers) {    
        for (const key in options.headers) {
            if (options.headers.hasOwnProperty(key)) {
                const value = options.headers[key];
                xhr.setRequestHeader(key, value);
            }
        }
    }
    xhr.addEventListener('load', e => {
        const response = xhr.responseText;
        if (xhr.status >= 200 && xhr.status < 300) {
            callbacks.onsuccess(response);
            return;
        }

         const {error} = JSON.parse(response);
         callbacks.onerror(error);
        
    });

    xhr.addEventListener('error', e => {
        callbacks.onerror('error.network');
    });

    xhr.addEventListener('loadend', e => {
        callbacks.oncomplete();
    });

    xhr.send(options.body || null);
}