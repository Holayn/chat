<template>
  <div class="h-screen">
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {
}
</script>

<style lang="scss">
  ::-webkit-scrollbar {
    width: 10px;
  }

  ::-webkit-scrollbar-track {
    background: #454545;
  }

  ::-webkit-scrollbar-thumb {
    background: lightslategray;
    border-radius: 50px;
  }
</style>
