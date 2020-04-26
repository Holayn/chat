<template>
  <div>
    <input v-model="username">
    <button @click="login()">Login</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  private username: any = '';

  private async login() {
    const res = await fetch(`http://localhost:8000/users/findByUsername?username=${this.username}`);
    const userInfo = (await res.json());
    userInfo.userId = userInfo['user-id'];
    delete userInfo['user-id'];
    this.$store.dispatch('setUser', userInfo);

    this.$router.push('/messages');
  }
}
</script>
