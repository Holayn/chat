<template>
  <div class="flex flex-auto items-center">
    <div class="animate-spin h-10 w-10 mr-3 border-t-2 rounded-full" style="border-top-color: orange">
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';

@Component({})
export default class Loading extends Vue {}
</script>