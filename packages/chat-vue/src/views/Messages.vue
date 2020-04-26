<template>
  <div>
    <h1>Messages</h1>
    <div class="messages">
      <div class="sessions-section">
        <div class="session-card" v-for="(session, i) in sessions" :key="i" @click="selectSession(session)">
          <span>
            {{displayUsers(session)}}
          </span>
        </div>
      </div>
      <div class="chat-section">
        <div class="chat-card" v-for="(chat, i) in chats" :key="i">
          {{chat}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class extends Vue {
  private sessions: any[] = [];
  private chats: any[] = [];
  private selectedSession: string = '';

  @Watch('selectedSession')
  private onSessionChange() {
    this.getChats(this.selectedSession);
  }

  get user() {
    return this.$store.getters.user;
  }

  private selectSession(session: any) {
    this.selectedSession = session['session-id'];
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

  private async getChats(selectedSession: string) {
    const res = await fetch(`http://localhost:8000/chats?session_id=${selectedSession}`);
    this.chats = await res.json();
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
    // flex: auto;
    width: 15%;
  }

  .chat-section {
    // flex-grow: 6;
    width: 85%;
  }
</style>
