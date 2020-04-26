<template>
  <div>
    <h1>Messages</h1>
    <div class="messages">
      <div class="sessions-section">
        <div class="session-card" v-for="(session, i) in sessions" :key="i" @click="selectSession($event.target.innerText)">
          <span>
            {{displayUsers(session)}}
          </span>
        </div>
      </div>
      <div class="chat-section">
        hello there
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  private sessions: any[] = [];
  private selectedSession: string = '';

  get user() {
    return this.$store.getters.user;
  }

  private selectSession(session: string) {
    this.selectedSession = session;
  }

  private displayUsers(session: any) {
    return session.users.join();
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

<style lang="scss" scoped>
  .messages {
    display: flex;
  }
  .session-card {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;

    .selected {
      background-color: lightblue;
    }
  }
  .session-card:nth-child(even) {
    background-color: white;
  }
  .session-card:nth-child(odd) {
    background-color: whitesmoke;
  }

  .sessions-section {
    flex: auto;
  }

  .chat-section {
    flex-grow: 6;
  }
</style>
