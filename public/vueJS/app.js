Vue.component('note-list', {
    props : ['note', 'index'],
    template : `
    <!-- <a style="display: inline-block" title="click for note details" href="./noteDetails.html"> -->
        <div id="note-block">
            <a v-if="note.trash" @click="$emit('recover-note', note.id)">recover</a>
            <span v-else style="font-size : 11px; color : green">{{note.dateCreated}}</span>
            <button type="button" @click="$emit('remove', note.id)" class="close" data-dismiss="modal" aria-label="Close">
                <span @mouseover="{title : (note.trash ? 'remove permanently' : 'remove')}"
                aria-hidden="true">&times;</span>
            </button>
            <br><div>
                <p><strong>Title : </strong><span class="detail">{{note.title}}</span></p>
                <p><strong @click="showDetails ? showDetails = false : showDetails = true " class="noteDetailLabel">Total Notes : </strong><span class="detail">{{this.totalNotes > 0?this.totalNotes : note.body.length}}</span></p>
                <p v-if="showDetails === true && note.body.length > 0">
                    <ul v-for="detail in this.totalNotes > 0 ? note.body.filter((el)=> !el.trash) : note.body">
                        <li>
                            <span class="noteDescriptionLabel">{{detail.description}}</span>
                            <span v-if="detail.price"> : {{detail.price}}</span>
                            <span v-else-if="detail.reminderDate"> : {{detail.reminderDate}}</span>
                        </li>
                    </ul>
                </p>
                <p v-if="totalAmount > 0"><strong>Total Amount : </strong><span class="detail">{{totalAmount}}</span></p>
            </div>
            <div class="details" @click="$emit('go-to', 'note-details',note.title, note.id)">
                <p>more details...</p>
            </div>
        </div>
    <!-- </a> -->
    `,
    data(){
        return {
            showDetails : false,
            totalNotes : 0
        }
    },
    computed : {
        // totalAmount(){console.log(this.index); return 0;},
        totalAmount() {
            let total = 0;
            this.totalNotes = 0;

            this.note.body.forEach((details) => {
                if(details.trash === false){
                    total += parseInt(details.price);
                    this.totalNotes++;
                }
            })
            return total;
        }
    }
})

 app = new Vue({
    el : '#app',
    data : {
        heading : '',
        note : {
            id : null,
            title : null,
            type : 'general-note',
            trash : false
        },
        description : '',
        price : undefined,
        reminderDate : undefined,
        show : 'saved notes',
        addNotePage : false,
        addNoteSearch : false,
        addNoteInput : '',
        activeBgColor : false,
        notes : getNotes()
    },
    methods : {
        onSubmit(e){
            e.preventDefault();
            console.log('on submit....', this.note.type);
            console.log('general price : ', this.price);
            this.note.body = [];

            if(this.note.title === '' || this.description === ''){
                alert('Please enter title or description');
                return
            }else{
                if(this.price){
                    this.note.body.push({
                        description : this.description,
                        price : this.price,
                        // dateCreated : null,
                        // lastUpdated : null,
                    })
                    console.log(this.note.body);
                }else if(this.reminderDate){
                    this.note.body.push({
                        description : this.description,
                        reminderDate : this.reminderDate,
                        // dateCreated : null,
                        // lastUpdated : null,
                    })
                    console.log('date to remind : ', this.note.body.reminderDate);
                }else{
                    this.note.body.push({
                        description : this.description,
                        // dateCreated : null,
                        // lastUpdated : null,
                    })
                }
                addNote(this.note, getNotes());
                this.note.title = null;
                this.price = null;
                this.description = null;
                this.reminderDate = null;
                
                this.notes = getNotes();
            }
        },
        goTo(page, title = undefined, id = null){
            let query = `?address=${title}#${id}`
            if(page === 'index'){
                this.show = 'saved notes';
            }
            if(!title && !id){
                query = ''
            }

            location.assign(page + query);
        },
        // notesModal : () => location.assign('notesModal.hbs'),
        typeOfNote(type){
            this.note.type = type.target.value;
        },
        removeNote(id){
            console.log(id)
            let notes = getNotes();
            let index = notes.findIndex((el)=> el.id === id);
            console.log(index, notes.length)
            
            if(notes[index].trash === true){
                if(notes.length === 1){
                    notes = [];
                }else{
                    notes = notes.filter((note)=> note.id !== id);
                }
            }else{
                notes[index].trash = true;
                for(let i=0; i< notes[index].body.length; i++){
                    notes[index].body[i].trash = true;
                }
                notes[index].trashTime = new Date().toDateString();
                console.log(notes[index]);
            }

            saveNotes(notes);
            this.notes = notes;
        },
        recoverNote(id){
            //it'll not recover it's body from trash
            let index = this.notes.findIndex((el)=> el.id === id);
            console.log(id);
            if(this.notes[index].body.length === 1){
                this.notes[index].body[0].trash = false;
            }
            this.notes[index].trash = false;

            if(this.notes[index].body.every((el)=> el.trash)){
                for(let i=0; i<this.notes[index].body.length; i++){
                    this.notes[index].body[i].trash = false;
                }
            }

            saveNotes(this.notes);
        }
    },
    computed : {
        renderNotes(){
            let renderNotes = this.notes
            if(this.show === 'trash notes' && this.notes){
                activeBgColorBtn1 = false;
                renderNotes = this.notes.filter((note)=> note.trash);
            }else if(this.show === 'saved notes' && this.notes){
                activeBgColor = false;
                renderNotes = this.notes.filter((note)=> !note.trash);
            }else{
                renderNotes = null
            }
            if(this.addNoteSearch === true && this.notes){
                return renderNotes.filter((note)=> note.title === this.addNoteInput);
            }
            return renderNotes;
        }
    }
})