<template>
  <div class="h-full">
    <div v-if="isConnecting" class="absolute flex h-full w-full flex-col items-center bg-orange-200 bg-opacity-50">
      <div class="flex flex-auto items-center">
        <div class="animate-spin h-5 w-5 mr-3 border-2 border-t-2 rounded-full" style="border-top-color: orange" viewBox="0 0 24 24">
        </div>
      </div>
    </div>
    <div class="flex flex-col h-full ">
      <Toolbar></Toolbar>
      <router-view class="flex-grow"/>
    </div>
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