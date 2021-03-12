console.log('script js')
const noteSearchId = document.querySelector('#note-search');
const noteSearchClass = document.querySelector('.note-search');
// const addNote1 = document.querySelector('#add-note')
// const form = document.querySelector('form');

// addNote1.addEventListener('submit', (e) =>{
//     et.preventDefault ? e.preventDefault() : e.returnValue = false;

//     addNote(app.note, form, getNotes());
//     app.notes = getNotes();
//     console.log('hey ....')
// })

//searching for note from index page using id
if(noteSearchClass === null){
    noteSearchId.addEventListener('input', () =>{
        console.log('search value : ' + noteSearchId.value);
        console.log(searchNote(noteSearchId.value));
        app.notes = searchNote(noteSearchId.value);
    })
}else{          //searching for note from addNote page using class
    noteSearchClass.addEventListener('input', () =>{
        app.addNoteSearch = true;
        app.notes = searchNote(noteSearchClass.value, 'add-note');
    })
}