<template>
  <div class="flex flex-col justify-center items-center h-full bg-gray-900">
    <div class="flex flex-col items-center w-6/12 h-6/12 p-6 space-y-3 rounded-lg bg-gray-800">
      <input class="shadow appearance-none rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="username" placeholder="username">
      <input class="shadow appearance-none rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" v-model="password" placeholder="password">
      <button
        class="flex-initial inline-block w-3/12 text-sm px-4 py-2 leading-none rounded text-white bg-orange-500 hover:border-transparent hover:text-white hover:bg-orange-700 mt-4 lg:mt-0"
        @click="login()">
        Login
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  private username = '';
  private password = '';

  created() {
    window.addEventListener('keyup', this.onEnterPressed);
  }

  destroyed() {
    window.removeEventListener('keyup', this.onEnterPressed);
  }

  private async login() {
    if (!this.username || !this.password) {
      return;
    }

    const login = await this.$store.dispatch('login', {
      username: this.username,
      password: this.password,
    });

    if (!login) {
      alert('login failed');
    }
  }

  private onEnterPressed(key: KeyboardEvent) {
    if (key.code === 'Enter') {
      this.login();
    }
  }
}
</script>
