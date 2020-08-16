<template>
  <div>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  computed: {
    hasUser() {
      return this.$store.getters.hasUser;
    },
  },
  watch: {
    hasUser: {
      handler(hasUser: boolean) {
        if (!hasUser) {
          (<any>this).$router.push({
            name: 'login'
          });
          return;
        }

        if ((<any>this).$route.name !== 'messages') {
          (<any>this).$router.push({
            name: 'messages'
          });
        }
      },
      immediate: true,
    },
  }
})

</script>

<style lang="scss"></style>
