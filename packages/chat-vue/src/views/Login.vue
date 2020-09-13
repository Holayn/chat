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
            <v-toolbar-title>Login</v-toolbar-title>
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
              <v-text-field
                id="password"
                label="Password"
                name="password"
                type="password"
                v-model="password"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="login()">Login</v-btn>
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
