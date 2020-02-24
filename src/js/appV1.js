const apiUrl = 'http://localhost:9999/api';

const rootEl = document.getElementById('root');
let posts = [];

getAllPosts();
// getPostById('XPost');
// createPost({id: 0, name: 'Last post'});


const language = 'ru';

const translations = {
    ru: {
        'error.not_found': 'Объект не найден',
        'error.bad_request': 'Произошло ошибка',
        'error.unknown': 'Произошло ошибка',
        'error.network': 'Проверьте своё соединение'
    },
    en: {
        'error.not_found': 'Object not found',
        'error.bad_request': 'Error ocurred',
        'error.unknown': 'Error ocurred',
        'error.network': 'check your internet connection'
    }
};

function translateError(code) {
    return translations[language][code] || translations[language]['error.bad_request.unknown'];
}

function getAllPosts() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}/posts`);

    xhr.addEventListener('load', e => {
        const response = xhr.responseText;
        posts = JSON.parse(response);
        console.log(posts);
    });

    xhr.addEventListener('error', e => {

    });

    xhr.addEventListener('loadend', e => {

    });

    xhr.send();
}

function getPostById(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `${apiUrl}/posts/${id}`);

    xhr.addEventListener('load', e => {
        const response = xhr.responseText;
        if (xhr.status >= 200 && xhr.status < 300) {
            const post = JSON.parse(response);
            console.log(post);
            return;
        }

        const {error} = JSON.parse(response);
        console.log(translateError(error));
        
    });

    xhr.addEventListener('error', e => {
        console.log(translateError('error.network'));
    });

    xhr.addEventListener('loadend', e => {

    });

    xhr.send();
}

function createPost(post) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${apiUrl}/posts`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.addEventListener('load', e => {
        const response = xhr.responseText;
        if (xhr.status >= 200 && xhr.status < 300) {
            getAllPosts();
            return;
        }

        const {error} = JSON.parse(response);
        console.log(translateError(error));
        
    });

    xhr.addEventListener('error', e => {
        console.log(translateError('error.network'));
    });

    xhr.addEventListener('loadend', e => {

    });

    xhr.send(JSON.stringify(post));
}