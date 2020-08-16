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
                <th class="text-center">Friends</th>
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
        <div class="chat-card" v-for="chat in chats" :key="chat['chat-id']">
          {{displayName(chat['user-id'])}} at {{new Date(new Number(chat.timestamp))}}: {{chat.message}}
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { API_URL } from '../shared';
import { getChats, IChat } from '../chat';
import { getUserById, IUser } from '../user';
import { ISession } from '../session';

@Component({})
export default class extends Vue {
  private selectedSession: ISession = {} as ISession;
  private selectedUser: IUser = {} as IUser;

  private created() {
    this.$store.dispatch('getSessions');
  }

  get sessions() {
    return this.$store.getters.sessions;
  }

  get chats() {
    return this.$store.getters.chats.sort((chatA: IChat, chatB: IChat) => {
      if (chatA.timestamp < chatB.timestamp) {
        return -1;
      } else if (chatA.timestamp > chatB.timestamp) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  @Watch('sessions')
  private onSessionChange() {
    if (this.sessions.length !== 0 && Object.keys(this.selectedSession).length === 0) {
      this.getChats(this.sessions[0]);
    }
  }

  private selectSession(session: ISession) {
    this.selectedSession = session;
    this.getChats(session);
  }

  private displayUsers(session: ISession) {
    return session.users.map((user: any) => user.name).join(',');
  }

  private displayName(id: string) {
    if (id === this.selectedUser['user-id']) {
      return this.selectedUser.name;
    }

    if (id === this.$store.getters.user['user-id']) {
      return this.$store.getters.user.name;
    }
  }

  private async getChats(session: ISession) {
    this.$store.dispatch('getChats', session['session-id']);
    this.selectedUser = await getUserById(session.users[0]['user-id']);
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
