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
        //checking for note title, note type and also if note is in trash or not
        if(notes[i].title === note.title && notes[i].type === note.type && notes[i].trash === false){
            isNoteDuplicate = i;
            break;
        }
    }
    //IS FINDINDEX FASTER THAN FOR LOOP OR VICE_VERSA
    // const filteredNotes = notes.filter((el)=> el.title === note.title);
    // const duplicateNote = notes.findIndex((el) => el.title === note.title);
    // const isDuplicateType = filteredNotes.findIndex((el) => el.type === note.type);
    // console.log('index : ', duplicateNote, isNoteDuplicate);
    // console.log('type : ', isDuplicateType);
    
    if(isNoteDuplicate > -1){
        const bodySize = notes[isNoteDuplicate].body.length;
        const duplicateDesc = notes[isNoteDuplicate].body.findIndex((el)=> el.description === note.body[0].description);

        if(duplicateDesc > -1){
            console.log('duplicate desc');
            notes[isNoteDuplicate].lastUpdated = new Date().toDateString();
            // console.log('befr ',notes[duplicateNote].body[duplicateDesc].price)
            notes[isNoteDuplicate].body[duplicateDesc].price = parseInt(notes[isNoteDuplicate].body[duplicateDesc].price) + parseInt(note.body[0].price);
        }else{
            //new body details added to the same note
            note.body[0].id = notes[isNoteDuplicate].body[bodySize-1].id + 1;
            note.body[0].dateCreated = new Date().toDateString();
            note.body[0].lastUpdated = new Date().toDateString();
            note.body[0].trash = false;
            console.log('not duplicate desc', note.body);
            notes[isNoteDuplicate].body.push(note.body[0]);
        }

        console.log('body : ', notes[isNoteDuplicate]);
    }else{
        console.log('not duplicate');
        note.dateCreated = new Date().toDateString();
        note.lastUpdated = new Date().toDateString();
        note.id = notes.length > 0 ? notes[notes.length-1].id + 1 : 101;        //note id
        note.body[0].id = 101;                      //body id
        note.body[0].dateCreated = new Date().toDateString();
        note.body[0].lastUpdated = new Date().toDateString();
        note.body[0].trash = false;
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

//for note details it'll return specific note's detail
const getNote = (id) => {
    console.log('get note from here...')
    let notes = getNotes();
    let note = []
    let index = notes.findIndex((el)=> el.id === id);

    console.log(index)

    if(index > -1){
        console.log(index, notes)

        for(let i=0; i < notes[index].body.length; i++){
            note.push({
                id : id,
                title : notes[index].body[i].description,
                type : notes[index].type,
                body : (notes[index].body[i].price ? notes[index].body[i].price : notes[index].body[i].reminderDate),
                dateCreated : notes[index].body[i].dateCreated,
                lastUpdated : notes[index].body[i].lastUpdated,
                trash : notes[index].body[i].trash
            })
        }
    }
    return [note, index];
}

const searchNote = (keyword = '', type = 'search') =>{
    let notes = getNotes();
    console.log(notes);
    if(type === 'search' && notes.length > 0){
        return notes.filter((note)=> note.title.toLowerCase().includes(keyword.toLowerCase()));
    }else if(notes.length > 0){
        return notes.filter((note)=> note.title.toLowerCase() === keyword.toLowerCase());
    }
    
}