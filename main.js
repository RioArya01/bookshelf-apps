const bookshelfApps = "BOOKSHELF_APPS";
const inputBook = document.getElementById("inputBook");
const searchBook = document.getElementById("searchBook");

function CheckForStorage() {
    return typeof Storage !== "undefined";
}

inputBook.addEventListener("submit", function (event) {
    const title = document.getElementById("inputBookTitle").value;
    const author = document.getElementById("inputBookAuthor").value;
    const year = parseInt(document.getElementById("inputBookYear").value);
    const isComplete = document.getElementById("inputBookIsComplete").checked;

    const idTemp = document.getElementById("inputBookTitle").name;
    if (idTemp !== "") {
        const booksData = GetBookList();
        for (let index = 0; index < booksData.length; index++) {
        if (booksData[index].id == idTemp) {
            booksData[index].title = title;
            booksData[index].author = author;
            booksData[index].year = year;
            booksData[index].isComplete = isComplete;
        }
        }
        localStorage.setItem(bookshelfApps, JSON.stringify(booksData));
        ResetAllForm();
        RenderBookList(booksData);
        return;
    }

    const id = JSON.parse(localStorage.getItem(bookshelfApps)) === null ? 0 + Date.now() : JSON.parse(localStorage.getItem(bookshelfApps)).length + Date.now();
    const newBook = {
        id: id,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
    };

    PutBookList(newBook);

    const booksData = GetBookList();
    RenderBookList(booksData);
});

function PutBookList(data) {
    if (CheckForStorage()) {
        let booksData = [];

        if (localStorage.getItem(bookshelfApps) !== null) {
        booksData = JSON.parse(localStorage.getItem(bookshelfApps));
        }

        booksData.push(data);
        localStorage.setItem(bookshelfApps, JSON.stringify(booksData));
    }
}

function RenderBookList(booksData) {
    if (booksData === null) {
        return;
    }

    const containerIncomplete = document.getElementById("incompleteBookshelfList");
    const containerComplete = document.getElementById("completeBookshelfList");

    containerIncomplete.innerHTML = "";
    containerComplete.innerHTML = "";
    for (let book of booksData) {
        const id = book.id;
        const title = book.title;
        const author = book.author;
        const year = book.year;
        const isComplete = book.isComplete;

    let bookItem = document.createElement("article");
    bookItem.classList.add("book_item", "select_item");
    bookItem.innerHTML = "<h3 name = " + id + ">" + title + "</h3>";
    bookItem.innerHTML += "<p>Penulis: " + author + "</p>";
    bookItem.innerHTML += "<p>Tahun: " + year + "</p>";

    let containerActionItem = document.createElement("div");
    containerActionItem.classList.add("action");

    const btnGreen = CreatebtnGreen(book, function (event) {
        isCompleteBookHandler(event.target.parentElement.parentElement);

        const booksData = GetBookList();
        ResetAllForm();
        RenderBookList(booksData);
    });

    const btnRed = CreatebtnRed(function (event) {
        DeleteItem(event.target.parentElement.parentElement);

        const booksData = GetBookList();
        ResetAllForm();
        RenderBookList(booksData);
    });

    containerActionItem.append(btnGreen, btnRed);

    bookItem.append(containerActionItem);

    if (isComplete === false) {
        containerIncomplete.append(bookItem);
        bookItem.childNodes[0].addEventListener("click", function (event) {
            UpdateItem(event.target.parentElement);
        });

        continue;
    }

    containerComplete.append(bookItem);

    bookItem.childNodes[0].addEventListener("click", function (event) {
        UpdateItem(event.target.parentElement);
    });
    }
}

function CreatebtnGreen(book, eventListener) {
    const isFinish = book.isComplete ? "Belum selesai" : "Selesai";

    const btnGreen = document.createElement("button");
    btnGreen.classList.add("green");
    btnGreen.innerText = isFinish + " di Baca";
    btnGreen.addEventListener("click", function (event) {
        eventListener(event);
    });
    return btnGreen;
}
function CreatebtnRed(eventListener) {
    const btnRed = document.createElement("button");
    btnRed.classList.add("red");
    btnRed.innerText = "Hapus buku";
    btnRed.addEventListener("click", function (event) {
        eventListener(event);
    });
    return btnRed;
}

function isCompleteBookHandler(itemElement) {
    const booksData = GetBookList();
    if (booksData.length === 0) {
        return;
    }

    const title = itemElement.childNodes[0].innerText;
    const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
    for (let index = 0; index < booksData.length; index++) {
        if (booksData[index].title === title && booksData[index].id == titleNameAttribut) {
        booksData[index].isComplete = !booksData[index].isComplete;
        break;
        }
    }
    localStorage.setItem(bookshelfApps, JSON.stringify(booksData));
}

function SearchBookList(title) {
    const booksData = GetBookList();
    if (booksData.length === 0) {
        return;
    }

    const bookList = [];

    for (let index = 0; index < booksData.length; index++) {
        const tempTitle = booksData[index].title.toLowerCase();
        const tempTitleTarget = title.toLowerCase();
        if (booksData[index].title.includes(title) || tempTitle.includes(tempTitleTarget)) {
        bookList.push(booksData[index]);
        }
    }
    return bookList;
}

function BtnGreenHandler(parentElement) {
    let book = isCompleteBookHandler(parentElement);
    book.isComplete = !book.isComplete;
}

function GetBookList() {
    if (CheckForStorage) {
        return JSON.parse(localStorage.getItem(bookshelfApps));
    }
    return [];
}

function DeleteItem(itemElement) {
    const booksData = GetBookList();
    if (booksData.length === 0) {
        return;
    }

    const titleNameAttribut = itemElement.childNodes[0].getAttribute("name");
    for (let index = 0; index < booksData.length; index++) {
        if (booksData[index].id == titleNameAttribut) {
        booksData.splice(index, 1);
        break;
        }
    }

    localStorage.setItem(bookshelfApps, JSON.stringify(booksData));
}

function UpdateItem(itemElement) {
    if (itemElement.id === "incompleteBookshelfList" || itemElement.id === "completeBookshelfList") {
        return;
    }

    const booksData = GetBookList();
    if (booksData.length === 0) {
        return;
    }

    const title = itemElement.childNodes[0].innerText;
    const author = itemElement.childNodes[1].innerText.slice(9, itemElement.childNodes[1].innerText.length);
    const getYear = itemElement.childNodes[2].innerText.slice(7, itemElement.childNodes[2].innerText.length);
    const year = parseInt(getYear);

    const isComplete = itemElement.childNodes[3].childNodes[0].innerText.length === "Selesai di baca".length ? false : true;

    const id = itemElement.childNodes[0].getAttribute("name");
    document.getElementById("inputBookTitle").value = title;
    document.getElementById("inputBookTitle").name = id;
    document.getElementById("inputBookAuthor").value = author;
    document.getElementById("inputBookYear").value = year;
    document.getElementById("inputBookIsComplete").checked = isComplete;

    for (let index = 0; index < booksData.length; index++) {
        if (booksData[index].id == id) {
        booksData[index].id = id;
        booksData[index].title = title;
        booksData[index].author = author;
        booksData[index].year = year;
        booksData[index].isComplete = isComplete;
        }
    }
    localStorage.setItem(bookshelfApps, JSON.stringify(booksData));
}

searchBook.addEventListener("submit", function (event) {
    event.preventDefault();
    const booksData = GetBookList();
    if (booksData.length === 0) {
        return;
    }

    const title = document.getElementById("searchBookTitle").value;
    if (title === null) {
        RenderBookList(booksData);
        return;
    }
    const bookList = SearchBookList(title);
    RenderBookList(bookList);
});

function ResetAllForm() {
    document.getElementById("inputBookTitle").value = "";
    document.getElementById("inputBookAuthor").value = "";
    document.getElementById("inputBookYear").value = "";
    document.getElementById("inputBookIsComplete").checked = false;

    document.getElementById("searchBookTitle").value = "";
}

window.addEventListener("load", function () {
    if (CheckForStorage) {
        if (localStorage.getItem(bookshelfApps) !== null) {
        const booksData = GetBookList();
        RenderBookList(booksData);
        }
    } else {
        alert("Browser Tidak Mendukung Web Storage");
    }
});