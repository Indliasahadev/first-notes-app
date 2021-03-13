Vue.component('note-list', {
    props : ['note', 'index'],
    template : `
    <!-- <a style="display: inline-block" title="click for note details" href="./noteDetails.html"> -->
        <div id="note-block" @click="$emit('go-to', 'note-details')">
            <a v-if="note.trash" @click="$emit('recover-note', note.id, note.title)">recover</a>
            <span v-else style="font-size : 11px; color : green">{{note.dateCreated}}</span>
            <button type="button" @click="$emit('remove', note.id, note.title)" class="close" data-dismiss="modal" aria-label="Close">
                <span @mouseover="{title : (note.trash ? 'remove permanently' : 'remove')}"
                aria-hidden="true">&times;</span>
            </button>
            <br><div>
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
        index : 0,
        show : 'saved note body'
    },
    methods :{
        removeNote(id, title){
            console.log(id, title, getNotes())
            // this.notes = getNotes();
            //id is not working because the argument id value is equal to this.notes[index].id
            //but we need id for this.notes1 which is this.notes[index].body hence we use title 
            //instead of id
            let index = this.notes1.findIndex((el)=> el.title === title);
            console.log(this.notes1[index]);

            let bodyLength = this.notes[this.index].body.filter((el)=> !el.trash)
            if(index > -1){
                if(this.notes1[index].trash === true){
                    this.notes1 = this.notes1.filter((note)=> note.title !== title);
                    console.log(this.notes1)

                    //in real notes there is description in body instead of title and this program this.notes1 = this.notes.body[specific index] 
                    this.notes[this.index].body = this.notes[this.index].body.filter((note)=> note.description !== title);
                    console.log(this.notes);
                    console.log('body length : ', this.notes[this.index].body.length)
                    if(this.notes[this.index].body.length === 0){

                        this.notes = this.notes.filter((note)=> note.body.length > 0 );
                    }
                }else{
                    if(bodyLength.length === 1){
                        console.log('body length : ', this.notes[this.index].body.length)
                        this.notes[this.index].trash = true;
                    }
                    console.log('body length : ', this.notes1[this.index], bodyLength.length)
                    this.notes1[index].trash = true;
                    console.log(this.notes[this.index])
                    this.notes[this.index].body[index].trash = true;
                    console.log(this.notes1[index], this.notes[this.index]);
                }
            }else{
                console.log('index : ', index)
            }

            saveNotes(this.notes);
        },
        recoverNote(id, title){
            let index = this.notes1.findIndex((el)=> el.title === title);
            if(this.notes[this.index].body.length === 1){
                this.notes[this.index].trash = false;
            }else if(this.notes[this.index].body.every((el)=> el.trash)){
                this.notes[this.index].trash = false
            }
            console.log(id);
            this.notes1[index].trash = false;
            this.notes[this.index].body[index].trash = false;
            saveNotes(this.notes);
        }
    },
    computed : {
        renderNote(){
            [this.notes1, index] = getNote(this.id);
            this.index = index;
            console.log(this.notes1)
            // this.notes[this.index].trash ? this.show = 'trash note body' : this.show = 'saved note body'

            if(this.show === 'saved note body'){
                return this.notes1.filter((el)=> !el.trash);
            }else if(this.show === 'trash note body'){
                return this.notes1.filter((el)=> el.trash);
            }else{
                console.log('nothing...');
                return 
            }
        }
    }
})