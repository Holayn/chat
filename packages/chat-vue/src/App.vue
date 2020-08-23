<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class App extends Vue {
  @Watch('hasUser', {immediate: true})
  public onHasUserUpdated(hasUser: boolean) {
    if (!hasUser) {
      this.$router.push({
        name: 'login',
      });
      return;
    }

    if (this.$route.name !== 'messages') {
      this.$router.push({
        name: 'messages',
      });
    }

    this.$store.dispatch('connect');
  }

  get hasUser() {
    return this.$store.getters.hasUser;
  }
}
</script>

<style lang="scss"></style>
