<template>
  <div class="group-grid">
      <h2><center>Here are our current image Groups</center></h2>
      <div class="group-grid__container">
        <div v-for="(group, index) in groups" :key="index" class="group-grid__images">
            <img :src="`${group.groupUrl}`" class="group-grid__images--img" alt="">
            {{group.description}}
        </div>
      </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return{
            groups: [],
        }
    },
    async created() {
        try{
            const theGroups = await axios.get('https://2cu6zhp8uk.execute-api.us-west-2.amazonaws.com/dev/getGroups')
            let theOptions = []
            //set up options for dropdown in ImageInput.vue -> add these options to store
            theOptions.push({'value': 'new', 'text': '>--Add a New group--<'})
            theGroups.data.groups.forEach((group)=> {
                theOptions.push(group.options)
                })
            this.$store.commit('setGroupsOptions', theOptions)
            this.groups = theGroups['data']['groups'].sort((a,b) => (a.groupId > b.groupId ? 1 : -1))
        } catch(e) {
            throw Error(e)
        }
    }
}
</script>

<style lang="scss">
.group-grid  {
    margin-top: 7rem;

    & h2 {
        text-transform: uppercase;
    }

    &__container {
        display: flex;
        align-items: center;
        justify-content: space-evenly;
    }
    &__images {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 2rem 0;
        
        &--img {
            margin-bottom: .5rem;
            height: 20rem;
        }
    }
}
</style>