<template>
  <div class="app">
    <h1 class="header-title">{{ title }}</h1>
    <div class="template" v-if="isEditor">
      <LeftSide/>
      <Editor/>
    </div>
    <div class="branchInfo" v-else>
      <div class="caption">
        <p>Either there is no branches or you didn't choosing a branch to view so add new branch or edit any available branch <span>by right click on the branch.</span> </p>
        <button @click="handleOpen">Open The Editor</button>
      </div>
    </div>
  </div>
</template>

<script>
import Editor from './components/Editor.vue'
import LeftSide from './components/LeftSide.vue';
import {mapState} from 'vuex';

export default {
  name: 'App',
  components:{ LeftSide, Editor },
  data(){
    return{
      title:'Welcome to kh best documentation side :)',
    }
  },
  computed:{
    ...mapState(["isEditor"]),
  },
  methods:{
    handleOpen(){
      this.$store.commit('openEditor');
    }
  }
}
</script>