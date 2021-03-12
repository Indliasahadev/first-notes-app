Vue.component('note-list', {
    props : ['note', 'index'],
    template : `
    <!-- <a style="display: inline-block" title="click for note details" href="./noteDetails.html"> -->
        <div id="note-block" @click="$emit('go-to', 'note-details')">
            <a v-show="note.trash" @click="$emit('recover-note', note.id)">recover</a>
            <button type="button" @click="$emit('remove', note.id)" class="close" data-dismiss="modal" aria-label="Close">
                <span @mouseover="{title : (note.trash ? 'remove permanently' : 'remove')}"
                aria-hidden="true">&times;</span>
            </button>
            <br><div class="details">
                <p><strong>Details : </strong><span class="detail">{{note.title}}</span></p>
                <p><strong>Type : </strong><span class="detail">{{note.type}}</span></p>
                <p><strong v-if="note.body > 0">Cost : </strong>
                    <strong v-else-if="note.body">Reminder Date : </strong>
                <span class="detail">{{note.body}}</span></p>
            </div>
        </div>
    <!-- </a> -->
    `,
    computed : {
        // totalAmount(){console.log(this.index); return 0;},
        // totalAmount() { return this.note.body.reduce((acc, cur) => acc + parseInt(cur.price), 0)}
    }
})

const app = new Vue({
    el : '#app',
    data : {
        id : parseInt(location.hash.split('#')[1]),
        notes1 : [],
        note : {
            id : parseInt(location.hash.split('#')[1]),
            title : '',
            type : '',
            description : '',
            dateCreated : '',
            lastUpdated : ''
        },
        notes : getNotes(),
        index : 0
    },
    methods :{
        removeNote(id){
            console.log(id)
            let index = this.notes.findIndex((el)=> el.id === id);
            if(this.notes[index].trash === true){
                this.notes = this.notes.filter((note)=> note.id !== id);
            }else{
                this.notes[index].trash = true;
                console.log(this.notes[index]);
            }

            saveNotes(this.notes);
        },
        recoverNote(id){
            console.log(id);
            this.notes[this.notes.findIndex((el)=> el.id === id)].trash = false;
            saveNotes(this.notes);
        }
    },
    computed : {
        getNote() {
            console.log(this.note.id)
            let index = this.notes.findIndex((el)=> el.id === this.note.id);
            console.log(index, this.notes)
            this.note.title = this.notes[index].title;
            this.note.description = this.notes[index].body.description
            console.log(index, this.notes, this.notes[index].body.length)

            for(let i=0; i < this.notes[index].body.length; i++){
                this.notes1.push({
                    id : this.id,
                    title : this.notes[index].body[i].description,
                    type : this.notes[index].type,
                    body : (this.notes[index].body[i].price ? this.notes[index].body[i].price : this.notes[index].body[i].reminderDate),
                    dateCreated : this.notes[index].body[i].dateCreated,
                    lastUpdated : this.notes[index].body[i].lastUpdated
                })
            }
            return this.notes1;
        }
    }
})