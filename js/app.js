import ajax from "./http.mjs";


const apiUrl = 'https://sunatullo-api.herokuapp.com/api';
const rootEl = document.getElementById('root');

let posts = [];
let editMode = false;
const currentPost = {
    id: 0,
    name: ''
};

rootEl.innerHTML = `<ul data-lists="lists"></ul>
<form data-form="add-form">
    <input type="text" data-title="title" placeholder="Enter your name" required>
    <button data-action="submit">Add</button>
</form>
<img id="loader" src="./images/loader.gif">
`;

getAllPosts();

const addForm = document.querySelector('[data-form=add-form]');
const title = document.querySelector('[data-title=title]');
const lists = document.querySelector('[data-lists=lists]');
const submit = document.querySelector('[data-action=submit]');
const loader = document.getElementById('loader');



   
let value = '';
title.addEventListener('input', e => {
    value = e.target.value;
});

addForm.addEventListener('submit', e => {
    e.preventDefault();
    loadingOn();
    if (editMode) {
        ajax(`${apiUrl}/posts`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: currentPost.id, name: value})
        }, {
            onsuccess: response => {
                lists.innerHTML = '';
                getAllPosts();
            },
            onerror: error => console.log(error),
            oncomplete: () => {}
        });
        submit.innerHTML = 'Add';
        editMode = false;
        
    } else {
        ajax(`${apiUrl}/posts`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: 0, name: value})
        }, {
            onsuccess: response => {
                lists.innerHTML = "";
                getAllPosts();
            },
            onerror: error => console.log(error),
            oncomplete: () => {}
        });
        
    }
    title.value = '';
})

function loadPosts(response) {
    posts = JSON.parse(response);
            posts.forEach(post => {
                const li = document.createElement('li');
                li.innerHTML = `${post.name} <button id="remove-${post.id}">x</button> <button id="edit-${post.id}">Edit</button>`;
                lists.appendChild(li);
                const delPostButton = document.getElementById(`remove-${post.id}`);
                const editPostButton = document.getElementById(`edit-${post.id}`);
                delPostButton.addEventListener('click', () => {
                    loadingOn();
                    delPost(post.id);
                });
                editPostButton.addEventListener('click', () => {
                    editPost(post.name, post.id);
                });
            });
            
}

function getAllPosts() {
    ajax(`${apiUrl}/posts`, undefined, {
        onsuccess: response => {
            loadPosts(response);
            loadingOff();
            
        },
        onerror: error => console.log(error),
        oncomplete: () => {
        }
    });
}


function delPost(id) {
    while(lists.firstElementChild) {
        lists.removeChild(lists.firstElementChild);
    }
    ajax(`${apiUrl}/posts/${id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: null
    }, {
        onsuccess: response => {
            getAllPosts();
        },
        onerror: error => console.log(error),
        oncomplete: () => {}
    });
}

function editPost(name, id) {
    submit.innerHTML = 'Edit';
    editMode = true;
    title.focus();
    title.value = name;
    currentPost.id = id;
    currentPost.name = name;
}

function loadingOn() {
    loader.classList.remove('hidden');
}

function loadingOff() {
    loader.classList.add('hidden');
}