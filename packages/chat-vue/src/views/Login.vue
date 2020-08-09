<template>
  <v-container fluid class="fill-height">
    <v-row
      justify="center"
      align="center"
    >
      <v-col cols="4">
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title> Login </v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                id="username"
                label="Username"
                name="username"
                type="text"
                v-model="username"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="login()"> Login </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  private username: any = '';

  private async login() {
    const res = await fetch(`${process.env.API_URL}/users/findByUsername?username=${this.username}`);
    const userInfo = (await res.json());
    userInfo.userId = userInfo['user-id'];
    delete userInfo['user-id'];
    this.$store.dispatch('setUser', userInfo);

    this.$router.push('/messages');
  }
}
</script>
