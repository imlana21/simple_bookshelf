const STORAGE_NAME = 'todo_apps';
const SAVED_EVENT = 'save_data';
const RENDER_EVENT = 'render_data';
let todos = [];
let tempTodos = [];

function isStorageExist() {
  if (typeof (Storage) !== undefined) return true;

  alert('Storage tidak tersedia');
  return false;
}

function buttonElement(id, status) {
  const btnContainer = document.createElement('div');
  btnContainer.classList.add('action');

  const btnDelete = document.createElement('button');
  btnDelete.classList.add('red');
  btnDelete.innerText = 'Hapus';
  btnDelete.addEventListener('click', () => {
    removeFromData(id);
  })

  const btnRead = document.createElement('button');
  btnRead.classList.add('green', 'book-status');
  btnRead.addEventListener('click', () => {
    toggleCompleteStatus(id, status);
  });

  if (status) {
    btnRead.innerText = 'Belum selesai dibaca';
  } else {
    btnRead.innerText = 'Selesai dibaca';
  }

  btnContainer.append(btnRead, btnDelete);

  return btnContainer;
}

function listBookElement(data) {
  const { id, title, author, year, is_complete } = data;

  const titleElement = document.createElement('h3');
  titleElement.innerText = title;

  const authorElement = document.createElement('p');
  authorElement.innerText = author;

  const yearElement = document.createElement('p');
  yearElement.innerText = year;

  const containerElement = document.createElement('article');
  containerElement.classList.add('book_item');
  containerElement.append(
    titleElement, 
    authorElement, 
    yearElement, 
    buttonElement(id, is_complete)
  );

  return containerElement;
}

function saveToLocalStorage() {
  const jsonStringify = JSON.stringify(todos);
  localStorage.setItem(STORAGE_NAME, jsonStringify);
  document.dispatchEvent(new Event(SAVED_EVENT));
}

function generateObject() {
  if (!isStorageExist()) return;

  const todoData = {
    id: +new Date(),
    title: document.getElementById('inputBookTitle').value,
    author: document.getElementById('inputBookAuthor').value,
    year: document.getElementById('inputBookYear').value,
    is_complete: document.getElementById('inputBookIsComplete').checked
  }

  todos.push(todoData);
}

function loadDataStorage() {
  if (!isStorageExist()) return;

  const serializedData = localStorage.getItem(STORAGE_NAME);
  const todoSaved = JSON.parse(serializedData);

  if (todoSaved == null) return;

  todos = [];
  tempTodos = [];
  todoSaved.map((data) => {
    todos.push(data);
    tempTodos.push(data);
  });


  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findData(id) {
  let data = null;
  
  data = todos.filter((todo) => {
    return todo.id === id ? todo : null
  });

  return data[0];
}

function findDataIndex(id) {
  for (const index in todos) {
    if (todos[index].id === id) {
      return index;
    }
  }
  return -1;
}

function removeFromData(id) {
  const todoIndex = findDataIndex(id);

  if(todoIndex === -1) return;

  todos.splice(todoIndex, 1);
  saveToLocalStorage();
}

function toggleCompleteStatus(id, status) {
  const todoData = findData(id);

  if(todoData == null || todoData === undefined) return;
  
  todos = tempTodos;
  todoData.is_complete = !status;
  removeFromData(id);
  todos.push(todoData);
  saveToLocalStorage();  
}

function searchFromStorage() {
  const searchInput = document.getElementById('searchBookTitle').value;

  if(searchInput != '') {
    const searchTitle = todos.find((data) => {
      return data.title == searchInput;
    });
    
    todos = [];
    todos.push(searchTitle);    
  } else {
    loadDataStorage();
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', () => {
  const inputBook = document.getElementById('inputBook');
  const searchForm = document.getElementById('searchBook');

  inputBook.addEventListener('submit', (event) => {
    event.preventDefault();

    generateObject();
    saveToLocalStorage();

    inputBook.reset();
  });

  searchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    searchFromStorage();
  })

  loadDataStorage();
});

//#region logging
document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
  loadDataStorage();
});

document.addEventListener(RENDER_EVENT, () => {
  const completeContainer = document.getElementById('completeBookshelfList');
  const incompleteContainer = document.getElementById('incompleteBookshelfList');

  completeContainer.innerHTML = '';
  incompleteContainer.innerHTML = '';

  todos.map((todo) => {
    const todoElement = listBookElement(todo);

    if(todo.is_complete) {
      completeContainer.append(todoElement);
    } else {
      incompleteContainer.append(todoElement);
    }
  });
});

//#endregion logging