Vue.component('note-list', {
    props : ['note', 'index'],
    template : `
    <!-- <a style="display: inline-block" title="click for note details" href="./noteDetails.html"> -->
        <div id="note-block">
            <a v-show="note.trash" @click="$emit('recover-note', note.id)">recover</a>
            <button type="button" @click="$emit('remove', note.id)" class="close" data-dismiss="modal" aria-label="Close">
                <span @mouseover="{title : (note.trash ? 'remove permanently' : 'remove')}"
                aria-hidden="true">&times;</span>
            </button>
            <br><div class="details" @click="$emit('go-to', 'note-details',note.title, note.id)">
                <p><strong>Title : </strong><span class="detail">{{note.title}}</span></p>
                <p><strong @click="showDetails = true" class="noteDetailLabel">Total Notes : </strong><span class="detail">{{note.body.length}}</span></p>
                <p v-if="showDetails === true && note.body.length > 0">
                    <ul v-for="detail in note.body">
                        <li><span class="noteDescriptionLabel">{{detail.description}}</span> : {{detail.price}}</li>
                    </ul>
                </p>
                <p v-if="totalAmount > 0"><strong>Total Amount : </strong><span class="detail">{{totalAmount}}</span></p>
            </div>
        </div>
    <!-- </a> -->
    `,
    data(){
        return {
            showDetails : false
        }
    },
    computed : {
        // totalAmount(){console.log(this.index); return 0;},
        totalAmount() { return this.note.body.reduce((acc, cur) => acc + parseInt(cur.price), 0)}
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
        addNoteSearch : false,
        notes : getNotes()
    },
    methods : {
        onSubmit(e){
            e.preventDefault();
            console.log('on submit....', this.note.type);
            console.log('general price : ', this.price);
            this.note.type = this.note.type;
            this.note.body = [];

            if(this.note.title === '' || this.description === ''){
                alert('Please enter title or description');
                return
            }else{
                if(this.price){
                    this.note.body.push({
                        description : this.description,
                        price : this.price,
                        dateCreated : null,
                        lastUpdated : null,
                    })
                    console.log(this.note.body);
                }else if(this.reminderDate){
                    this.note.body.push({
                        description : this.description,
                        reminderDate : this.reminderDate,
                        dateCreated : null,
                        lastUpdated : null,
                    })
                    console.log('date to remind : ', this.note.body.reminderDate);
                }else{
                    this.note.body.push({
                        description : this.description,
                        dateCreated : null,
                        lastUpdated : null,
                    })
                }
                addNote(this.note, getNotes());
                this.note.title = null;
                this.price = null;
                this.description = null;
                this.reminderDate = null;
                this.notes = getNotes();
            }
            this.goTo('index');
        },
        searchNote(key){
            console.log('key enter : ', key)
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
        notesModal : () => location.assign('notesModal.hbs'),
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
                notes[index].trashTime = new Date().toDateString();
                console.log(notes[index]);
            }

            saveNotes(notes);
            this.notes = notes;
        },
        recoverNote(id){
            console.log(id);
            this.notes[this.notes.findIndex((el)=> el.id === id)].trash = false;
            saveNotes(this.notes);
        }
    },
    computed : {
        renderNotes(){
            if(this.show === 'trash notes'){
                return this.notes.filter((note)=> note.trash);
            }else if(this.show === 'saved notes'){
                return this.notes.filter((note)=> !note.trash);
            }else{
                return
            }
        }
        // overallTransactionAmount : ()=> this.notes.reduce((acc, cur)=> {

        // })
    }
})