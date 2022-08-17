const STORAGE_NAME = "todo_apps";
const SAVED_EVENT = "save_data";

document.addEventListener('DOMContentLoaded', () => {
  const inputBook = document.getElementById("inputBook");

  inputBook.addEventListener('submit', (event) => {
    event.preventDefault();

    addToDo();
  })

  
});


function isStorageExist() {
  if(typeof(Storage) !== undefined) return true;

  alert('Storage tidak tersedia');
  return false;
}

function saveToLocalStorage() {
  if(!isStorageExist()) return;

  const todoData = {
    id: +new Date(),
    title: document.getElementById('inputBookTitle').value,
    author: document.getElementById('inputBookAuthor').value,
    year: document.getElementById('inputBookYear').value,
    isComplete: document.getElementById('inputBookIsComplete').checked
  }

  const jsonStringify = JSON.stringify(data);
  localStorage.setItem(STORAGE_NAME, jsonStringify);
}

function loadDataStorage() {
  const serializedData = localStorage.getItem('todo_apps');
}

//#region logging
document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
})
//#endregion logging