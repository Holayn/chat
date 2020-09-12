<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {isAuthorized} from './utils/auth';

@Component({})
export default class App extends Vue {
  created() {
    this.$store.dispatch('initialize');
  }

  @Watch('hasUser')
  public onHasUserUpdated(hasUser: boolean) {
    if (!hasUser) {
      return;
    }

    this.$store.dispatch('connect');
  }

  get hasUser() {
    return this.$store.getters.hasUser;
  }
}
</script>

<style lang="scss"></style>
