<template>
  <div>
     <div v-if="isConnecting">
        connecting to server...
      </div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
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
}


</script>