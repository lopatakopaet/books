const isLocalSource = true;
let formElem = document.querySelector('form');

let bookId;

const isIdExist = location.search.split('?id=');
if (isIdExist && isIdExist.length) {
    bookId = isIdExist[1];
}

if (bookId) {
    initForm(formElem, findBookById(bookId));

    formElem.querySelector('input[type="submit"]').value = 'Изменить'
}

function addBook(data) {
    addBookToLocalStorage(data)
}

function addBookToLocalStorage(data) {
    let arrStorage = getBooks();
    if (data && !data.id) {
        data.id = Math.floor(Math.random() * (1000000));
    }
    arrStorage.push(data);
    arrStorage = JSON.stringify(arrStorage);
    localStorage.setItem('books', arrStorage);
}

function deleteBook(id) {
    deleteBookFromLocalStorage(id);
}

function deleteBookFromLocalStorage(id) {
    let allBooks = getBooks();
    let index = allBooks.findIndex(elem => elem.id === +id);
    if (index !== -1) {
        allBooks.splice(index, 1);
        setBooks(allBooks);
    }
}

function getBooks() {
    if (isLocalSource) {
        return getBooksFromLocalStorage();
    } else {
        return getBooksFromServer();
    }
}

function getBooksFromServer() {
    return fetch('/books')
        .then(res => res.json());
}

function getBooksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('books'));
}

function setBooks(books) {
    setBooksToLocalStorage(books);
}

function setBooksToLocalStorage(books) {
    books = JSON.stringify(books);
    localStorage.setItem('books', books);
}


function serializeForm(form) {
    let obj = {};
    obj.photos = [];
    for (let i = form.elements.length - 1; i >= 0; i--) {

        if (form.elements[i].type === 'text') {
            if (form.elements[i].getAttribute('name') == 'photo') {
                obj.photos.push(form.elements[i].value);
            } else obj[form.elements[i].name] = form.elements[i].value;
        }
    }
    return obj;
}

function initForm(form, obj) {
    let numberPhoto = 0;
    if (obj.id) {
        form.dataset.bookId = obj.id;
    }
    document.querySelector('.photos').innerHTML = '';
    for (let i = 0; i < obj.photos.length; i++) {
        renderInputForAddPhoto();
        console.log(obj.photos)
    }
    for (let i = form.elements.length - 1; i >= 0; i--) {
        if (form.elements[i].type === 'text') {
            if (form.elements[i].getAttribute('name') == 'photo') {
                form.elements[i].value = obj.photos[numberPhoto];
                numberPhoto++;
            } else form.elements[i].value = obj[form.elements[i].name];
        }
    }
}

function findBookById(id) {
    return getBooks().find(elem => elem.id === +id);
}

function onSubmitForm(form) {
    let obj = serializeForm(form);

    if (Object.values(obj).some(value => {
        if (Array.isArray(value)) {
            return value.some( elem => !elem)
        } else {
            return !value;
        }
    })) {
        alert('Заполнены не все поля!');
        return;
    }
    if ('bookId' in form.dataset) {
        updateBookToLocalstorage(obj);
    } else addBook(obj);

    location.href = '/';
}
function renderInputForAddPhoto() {
    let elem = document.createElement('input');
    elem.type = 'text';
    elem.placeholder = 'добавить фото';
    elem.setAttribute('name', 'photo');
    let photosElem = document.querySelector('.photos');
    photosElem.appendChild(elem)
}

function updateBookToLocalstorage(obj) {
    let id = +formElem.dataset.bookId;
    obj.id = id;
    deleteBook(id);
    addBook(obj);
}

formElem.addEventListener('submit', function (e) {
    e.preventDefault();
    onSubmitForm(this);
});

document.querySelector('.add_photo').addEventListener('click', function (e) {
    e.preventDefault();
    renderInputForAddPhoto()
});