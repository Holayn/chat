<template>
  <nav class="flex items-center justify-between flex-wrap bg-orange-400 p-3">
    <div class="flex items-center flex-shrink-0 text-white mr-6">
      <span class="font-semibold text-xl tracking-tight">Kaichat</span>
    </div>
    <div class="block lg:hidden">
      <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
        <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
      </button>
    </div>
    <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div class="text-sm lg:flex-grow">
        <router-link to="/messages" class="block mt-4 lg:inline-block lg:mt-0 text-orange-200 hover:text-white mr-4">
          Messages
        </router-link>
      </div>
      <div>
        <a
          href="#"
          class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-orange-500 hover:bg-white mt-4 lg:mt-0"
          @click="logout()">
          Logout
        </a>
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({})
export default class Toolbar extends Vue {
  private logout() {
    this.$store.dispatch('logout');
  }
}
</script>