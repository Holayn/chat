<template>
  <div>
    <h1>Messages</h1>
    <div>
      <div v-for="(session, i) in sessions" :key="i">
        {{session['session-id']}} with users: {{session.users}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  public sessions: any = [];

  get user() {
    return this.$store.getters.user;
  }

  private created() {
    if (this.$store.getters.hasUser) {
      this.getSessions();
    } else {
      this.$router.push('/');
    }
  }

  private async getSessions() {
    const res = await fetch(`http://localhost:8000/users/sessions?user_id=${this.user.userId}`);
    this.sessions = await res.json();
  }
}
</script>
