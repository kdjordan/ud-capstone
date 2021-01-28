<template>
  <div class="image-input">
      <h3>Upload a New Image</h3>
      <form @submit.prevent="doUpload">
        <div>
            <label for="imageDesc">Image Description</label>
            <input type="text" name="imageDesc" v-model="imageDesc">
        </div>
        <div>
            <label for="group-select">Choose a group:</label>
                <select v-model="selectedGroup">
                    <option v-for="(option, index) in optionsArr" :key="index" :value="option['value']">
                        {{option['text']}}
                    </option>
                </select>
        </div>
        <div v-if="selectedGroup == 'new'">
            <label for="groups">New Group</label>
            <input type="text" name="groups" v-model="newGroup">
            <button @click="addGroup" class="add-button">ADD</button>
        </div>
        <input type="file" accept="image/*" @change="uploadImage($event)">
        <button class="add-button" type ="submit">Upload</button>
      </form>
      <!-- {{selectedGroup}}: -->
  </div>
</template>

<script>
export default {
data() {
    return {
        optionsArr: [
            {'value': 'new', 'text': '>--Add a New group--<'},
            {'value': 'dogs', 'text': 'Dogs'},
            {'value': 'cats', 'text': 'Cats'},
            {'value': 'technology', 'text': 'Technology'},
        ],
        selectedGroup: {'value': '', 'text': ''},
        newGroup: '',
        theImage: null,
        imageDesc: ''
    }
},
methods: {
    addGroup() {
        this.optionsArr.push({'value': this.newGroup.toLowerCase(), text: this.newGroup})
        this.selectedGroup = ''
    },
    uploadImage(e) {
        this.theImage = e.target.files[0]
    },
    doUpload() {
        console.log('group', this.selectedGroup)
        console.log('theImage', this.theImage)
        console.log('imageDesc', this.selectedGroup)
    }
}
}
</script>

<style lang="scss">
.image-input {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
    border-bottom: 1px solid var(--color-black);

    & label {
        margin-right: .5rem;
    }

    & input {
        margin: 1rem 0;
    }
}

.add-button {
    margin-left: 1rem
}
</style>