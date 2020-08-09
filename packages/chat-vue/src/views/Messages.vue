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
import {API_URL} from '../shared';
import {getSessions} from '../session';
import {getChats} from '../chat';
import {getUserById} from '../user';

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
    return session.users.map((user: any) => user.name).join(',');
  }

  private created() {
    if (this.$store.getters.hasUser) {
      this.getSessions();
    } else {
      this.$router.push('/');
    }
  }

  private async getSessions() {
    this.sessions = await getSessions(this.$store.getters.user.userId);
  }

  private async getChats(selectedSession: any) {
    this.chats = await getChats(selectedSession['session-id']);
    this.selectedUser = await getUserById(selectedSession.users[0]['user-id']);
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
