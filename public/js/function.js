const getNotes = (file = 'notes') => {
    const notes = localStorage.getItem(file);

    if(notes){
        return JSON.parse(notes);
    }
    return [];
}

const saveNotes = (notes, file = 'notes') =>{
    notes = JSON.stringify(notes);
    localStorage.setItem(file, notes);
}

const addNote = (note, notes) =>{

    let isNoteDuplicate

    for(let i=0; i<notes.length; i++){
        if(notes[i].title === note.title){
            //checking for type and also if note is in trash or not
            if(notes[i].type === note.type && notes[i].trash === false){
                isNoteDuplicate = i;
                break;
            }
        }
    }
    const filteredNotes = notes.filter((el)=> el.title === note.title);
    const duplicateNote = notes.findIndex((el) => el.title === note.title);
    const isDuplicateType = filteredNotes.findIndex((el) => el.type === note.type);
    console.log('index : ', duplicateNote, isNoteDuplicate);
    console.log('type : ', isDuplicateType);
    
    if(isNoteDuplicate > -1){
        console.log('duplicate', notes[isNoteDuplicate].body);
        console.log(note.body, note.body[0].description);

        const duplicateDesc = notes[isNoteDuplicate].body.findIndex((el)=> el.description === note.body[0].description);

        console.log('desc : ', duplicateDesc);

        if(duplicateDesc > -1){
            console.log('duplicate desc');
            notes[isNoteDuplicate].lastUpdated = new Date().toDateString();
            // console.log('befr ',notes[duplicateNote].body[duplicateDesc].price)
            notes[isNoteDuplicate].body[duplicateDesc].price = parseInt(notes[isNoteDuplicate].body[duplicateDesc].price) + parseInt(note.body[0].price);
        }else{
            console.log('not duplicate desc', note.body);
            notes[isNoteDuplicate].body.push(note.body[0]);
        }

        console.log('body : ', notes[isNoteDuplicate]);
    }else{
        console.log('not duplicate');
        note.dateCreated = new Date().toDateString();
        note.lastUpdated = new Date().toDateString();
        note.id = notes.length > 0 ? notes[notes.length-1].id + 1 : 101;
        console.log('note id : ', notes);
        notes.push(note);
    }

    saveNotes(notes);
}

const totalMoney = ()=>{
    let notes = getNotes();
    let total = 0;
    for(let i=0; i<notes.length; i++){
        if(notes[i].body.length > 1){
            for(let j=0; j<notes[i].body.length; j++){
                if(notes[i].body[j].price){
                    total += parseInt(notes[i].body[j].price);
                }
            }
        }else{
            if(notes[i].body[0].price){
                total += parseInt(notes[i].body[0].price);
            }
        }
    }
    console.log('money : ', total)
    return total;
}

totalMoney();


//for later
// const trashCleaner = ()=>{
//     console.log('trash cleaner here.....')
//     let notes = getNotes();
//     const diff = 60000;
//     // notes = notes.filter((note) => console.log(note.title, note.trashTime.getMinutes()));
//     // notes = notes;
//     console.log(notes);
// }
// let localDa = new Date().toDateString();
// console.log(new Date(localDa).getMinutes())

// trashCleaner();

const searchNote = (keyword = '', type = 'search') =>{
    let notes = getNotes();
    if(type === 'search'){
        return notes.filter((note)=> note.title.toLowerCase().includes(keyword.toLowerCase()));
    }else{
        return notes.filter((note)=> note.title.toLowerCase() === keyword.toLowerCase());
    }
    
}