<template>
  <v-container fluid>
    <v-row
      justify="center"
    >
      <v-col cols="4" class="text-center">
        <h1>Messages</h1>
      </v-col>
    </v-row>
    <v-row class="messages">
      <v-col cols="3" class="sessions-section">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center"> Friends </th>
              </tr>
            </thead>
            <tbody>
              <tr class="session-card" v-for="(session, i) in sessions" :key="i" @click="selectSession(session)">
                <td class="text-left"> {{ displayUsers(session) }} </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="8" class="chat-section">
        <div class="chat-card" v-for="(chat, i) in chats" :key="i">
          {{chat}}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

const API_URL = process.env.VUE_APP_API_URL;

@Component({})
export default class extends Vue {
  private sessions: any[] = [];
  private chats: any[] = [];
  private selectedSession: any = {};
  private selectedUser: any = {};

  @Watch('selectedSession')
  private onSessionChange() {
    this.getChats(this.selectedSession);
  }

  private selectSession(session: any) {
    this.selectedSession = session;
  }

  private displayUsers(session: any) {
    return session.users.map(user => user.name).join(',');
  }

  private created() {
    if (this.$store.getters.hasUser) {
      this.getSessions();
    } else {
      this.$router.push('/');
    }
  }

  private async getSessions() {
    const res = await fetch(`${API_URL}/users/sessions?user_id=${this.$store.getters.user.userId}`);
    this.sessions = await res.json();
  }

  private async getChats(selectedSession: any) {
    this.chats = await (await fetch(`${API_URL}/chats?session_id=${selectedSession['session-id']}`)).json();
    this.selectedUser = await (await fetch(`${API_URL}/users?user_id=${selectedSession.users.join()[0]}`)).json();
  }
}
</script>

<style lang="scss" scoped>
  .session-card {
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
</style>
