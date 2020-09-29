<template>
  <div class="flex flex-col justify-center items-center h-full bg-gray-900">
    <div class="flex flex-col items-center w-6/12 h-6/12 p-6 space-y-3 rounded-lg bg-gray-800">
      <input class="shadow appearance-none rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="username" placeholder="username">
      <input class="shadow appearance-none rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" v-model="password" placeholder="password">
      <input v-if="isCreate" class="shadow appearance-none rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="email" placeholder="email">
      <input v-if="isCreate" class="shadow appearance-none rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="name" placeholder="name">
      <div class="w-3/12 space-x-1">
        <button
          class="inline-block text-sm px-4 h-8 leading-none rounded-lg rounded-r-none text-white bg-orange-500 hover:border-transparent hover:text-white hover:bg-orange-700"
          @click="submit()">
          {{isCreate ? 'Create' : 'Login'}}
        </button>
        <button
          class="text-sm pl-2 pr-3 h-8 leading-none rounded-lg rounded-l-none text-white bg-orange-500 hover:border-transparent hover:text-white hover:bg-orange-700"
          @click="toggleCreate()">
          +
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {RequestError} from '../shared/errors';

@Component({})
export default class extends Vue {
  private username = '';
  private password = '';
  private email = '';
  private name = '';

  // State
  private isCreate = false;

  public created() {
    window.addEventListener('keyup', this.onEnterPressed);
  }

  public destroyed() {
    window.removeEventListener('keyup', this.onEnterPressed);
  }

  private async submit() {
    if (this.isCreate) {
      try {
        const create = await this.$store.dispatch('createAccount', {
          username: this.username,
          password: this.password,
          email: this.email,
          name: this.name,
        });

        alert('account created');
        this.isCreate = false;
      } catch (e) {
        if (e instanceof RequestError) {
          switch (e.code) {
            case 400:
              alert('missing info');
              return;
            case 409:
              alert('account already exists');
              return;
            default:
              alert('something went wrong');
              return;
          }
        }
      }
      return;
    }

    this.login();
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
      this.submit();
    }
  }

  private toggleCreate() {
    this.isCreate = !this.isCreate;
  }
}
</script>
