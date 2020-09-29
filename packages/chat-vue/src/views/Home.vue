<template>
  <div class="h-full">
    <div v-if="isConnecting" class="absolute flex h-full w-full flex-col items-center bg-orange-200 bg-opacity-50">
      <Loading/>
    </div>
    <div class="flex flex-col h-full">
      <Toolbar></Toolbar>
      <router-view class="flex-auto"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import Loading from '../components/Loading.vue';
import Toolbar from '../components/Toolbar.vue';

import {Socket} from '../sockets';

@Component({
  components: {
    Loading,
    Toolbar,
  },
})
export default class Home extends Vue {
  private isConnecting: boolean = false;

  public created() {
    this.$store.dispatch('initialize');
  }

  @Watch('hasUser', {immediate: true})
  public async onHasUserUpdated(hasUser: boolean) {
    if (!hasUser) {
      return;
    }

    this.isConnecting = true;
    try {
      await Socket.connect();
      this.isConnecting = false;
    } catch {
      alert('error connecting');
    }
  }

  get hasUser() {
    return this.$store.getters.hasUser;
  }

  private logout() {
    this.$store.dispatch('logout');
  }
}
</script>