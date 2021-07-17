var notesData 
var selectedIndex = 0;


if ('notes' in localStorage) {
    notesData = JSON.parse(localStorage.notes)
} else {
    notesData = [{title: '', content: ''}]
    localStorage.notes = JSON.stringify(notesData)
}

if (notesData.length == 0) notesData = [{title: '', content: ''}]


Vue.component('note-page', {
    props: ['note-data', 'index'],
    data: function() {
        const contentLimit = 20;
        const titleLimit = 16;
        var content = this.noteData.content
        var title = this.noteData.title

        if (content.length > contentLimit + 3) {
            content = content.slice(0, contentLimit + 1) + '...'
        }

        if (title.length > titleLimit + 3) {
            title = title.slice(0, titleLimit + 1) + '...'
        }

        return {
            title: title,
            content: content,
        }
    },
    template: `<div class="note-page">
    <h1 v-if="title != ''">{{ title }}</h1>
    <h1 v-else style="color: #666">Untitled</h1>
    <p v-if="content != ''">{{ content }}</p>
    <p v-else style="color: #666">Empty</p>
    </div>`,
    watch: {
        noteData() {
            const contentLimit = 20;
            const titleLimit = 16;
            var content = this.noteData.content
            var title = this.noteData.title

            if (content.length > contentLimit + 3) {
                content = content.slice(0, contentLimit + 1) + '...'
            }

            if (title.length > titleLimit + 3) {
                title = title.slice(0, titleLimit + 1) + '...'
            }

            this.title = title
            this.content = content
        }
    }
})

var app = new Vue({
    el: '#wrapper',
    data: {
        notesData: notesData,
        selectedIndex: selectedIndex,
        notes: notesData[selectedIndex].content,
        title: notesData[selectedIndex].title,
        trash: 'trash_icon.svg'
    },
    methods: {
        notesChanged: function() {
            if (this.notes.trim() === '') {
                this.notes = ''
            }

            var newData = {
                title: this.title,
                content: this.notes,
            }

            this.notesData[this.selectedIndex] = newData
            localStorage.notes = JSON.stringify(this.notesData)
        },
        titleChanged: function() {
            if (this.title.trim() === '') {
                this.title = ''
            }

            var newData = {
                title: this.title,
                content: this.notes,
            }

            this.notesData[this.selectedIndex] = newData
            localStorage.notes = JSON.stringify(this.notesData)
        },
        tabber: function(event) {
            if (event) {
              event.preventDefault()
              let startText = this.notes.slice(0, event.target.selectionStart)
              let endText = this.notes.slice(event.target.selectionStart)
              this.notes = `${startText}  ${endText}`
              event.target.selectionEnd = event.target.selectionStart + 1
            }
        },
        onSelected: function(index) {
            this.selectedIndex = index
            this.notes = this.notesData[this.selectedIndex].content
            this.title = this.notesData[this.selectedIndex].title
        },
        addNotes: function() {
            var newNotes = {
                title: '',
                content: '',
            }
            this.notesData.unshift(newNotes)
            this.selectedIndex = 0
            this.title = ''
            this.notes = ''
            localStorage.notes = JSON.stringify(this.notesData)
        },
        mouseOver: function() {
            this.trash = 'trash_icon_hover.svg'
        },
        mouseLeave: function() {
            this.trash = 'trash_icon.svg'
        },
        trashClicked: function() {
            this.notesData.splice(this.selectedIndex, 1)
            this.selectedIndex = 0

            if (this.notesData.length > 0) {
                this.notes = this.notesData[0].content
                this.title = this.notesData[0].title
            } else {
                this.notes = ''
                this.title = ''
            }
            localStorage.notes = JSON.stringify(this.notesData)
        }
    }
})