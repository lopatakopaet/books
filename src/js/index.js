// import './/AddBook';
import Slider from './Slider';


const isLocalSource = true;
let formElem = document.querySelector('form');
// let bookImgElem = document.querySelector('.book_img');
let booksArr = [
    {
        theme: 'фэнтези',
        phone: '1122334455',
        address: 'Польша, Варшава',
        publishing_house: 'superNOWA',
        data: '1996',
        author: 'Анджей Сапковский',
        photo: 'https://games-reviews.net/_pu/11/65989418.jpg',
        name_book: 'Кровь эльфов'
    }
];



///////////////////
function getBooks() {
    if (isLocalSource) {
        return getBooksFromLocalStorage();
    } else {
        return getBooksFromServer();
    }
}

function getBooksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('books'));
}

function getBooksFromServer() {
    return fetch('/books')
        .then(res => res.json());
}

function renderBook(parentElem, book) {
    let node = document.createElement('div');
    node.classList.add('book_block');
    node.innerHTML = `
        <div class="book_left-section">
            <div class="book_avatar_wrap">
                <img class="book_img" src="${getPhotos(book)[0]}" alt="photo" data-id ='${book.id}'> 
            </div>
            <input class="change_book_btn" type="button" value="Редактировать" data-id ='${book.id}'>
            <input class="delete_book_btn" type="button" value="Удалить" data-id ='${book.id}'>
        </div>
        <div class="book_info"  >
            <p>Название книги: ${book.name_book}.</p>
            <p>Рубрика: ${book.theme}.</p>
            <p>Автор(ы): ${book.author}.</p>
            <p>Издательство: ${book.publishing_house}.</p>
            <p>Адрес издательства: ${book.address}.</p>
            <p>Телефон издательства: ${book.phone}.</p>
            <p>Дата издательства: ${book.data}.</p>
        </div>
    `;
    parentElem.appendChild(node);
}

function renderBooksList(books) {
    let booksListElem = document.querySelector('.books_list');
    booksListElem.innerHTML = '';
    books.forEach(elem => renderBook(booksListElem, elem))
}

function deleteBookFromLocalStorage(id) {
    let allBooks = getBooks();
    let index = allBooks.findIndex(elem => elem.id === +id);
    if (index !== -1) {
        allBooks.splice(index, 1);
        setBooks(allBooks);
    }
}

function deleteBook(id) {
    deleteBookFromLocalStorage(id);
}

function findBookById(id) {
    return getBooks().find(elem => elem.id === +id);
}

function findBooksByName(name) {
    return getBooks().filter(book => book.name_book.toLowerCase().indexOf(name.toLowerCase()) !== -1);
}

document.querySelector('.books_list').addEventListener('click', function (e) {
    let id = e.target.getAttribute('data-id');

    ///////Удаление книги/////
    if (e.target.matches('.delete_book_btn')) {
        deleteBook(id);
        renderBooksList(getBooks());
    }
    /////Редактирование книги////
    if (e.target.matches('.change_book_btn')) {
        location.href = `/form.html?id=${id}`;
    }
    ////Просмотр фото////
    if (e.target.matches('.book_img')) {
        let book = findBookById(id);
        new Slider(getPhotos(book));
        e.stopPropagation()
    }
});

// document.addEventListener('click', function (e) {
//     let sliderImg = document.querySelector('.slider img');
//     if (sliderImg) {
//         // if (e.target !== sliderImg) {
//         //     sliderImg.remove();
//         // }
//     }
// });



renderBooksList(getBooks());

document.querySelector('.search_input').addEventListener('input', function (e) {
    let books = findBooksByName(this.value);
    renderBooksList(books);
});


function getPhotos(book) {
    return book.photos.slice();
}

