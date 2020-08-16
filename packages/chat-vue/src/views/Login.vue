<template>
  <div>
    <input v-model="username">
    <button @click="login()">Login</button>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Login',
  data() {
    return {
      username: '',
    }
  },
  methods: {
    async login() {
      this.$store.dispatch('login', this.username);
    }
  }
})
</script>
