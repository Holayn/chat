<template>
  <div class="h-full flex flex-col">
    <div v-if="isConnecting">
      connecting to server...
    </div>
    <Toolbar></Toolbar>
    <router-view class="flex-grow"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Toolbar from '../components/Toolbar.vue';

@Component({
  components: {
    Toolbar,
  }
})
export default class Home extends Vue {
  private isConnecting: boolean = false;

  created() {
    this.$store.dispatch('initialize');
  }

  @Watch('hasUser')
  public async onHasUserUpdated(hasUser: boolean) {
    if (!hasUser) {
      return;
    }

    this.isConnecting = true;
    await this.$store.dispatch('connect');
    this.isConnecting = false;
  }

  get hasUser() {
    return this.$store.getters.hasUser;
  }

  private logout() {
    this.$store.dispatch('logout');
  }
}
</script>