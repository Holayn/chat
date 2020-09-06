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
        <div class="chat-card" v-for="chat in chats" :key="chat.chatId">
          {{displayName(chat.userId)}} at {{new Date(new Number(chat.timestamp))}}: {{chat.message}}
        </div>
      </v-col>
    </v-row>
    <input v-model="message"/>
    <button @click="sendMessage()">Send</button>
    <div>
      Start a new chat
      <div>
        Search for user: <input v-model="userSearchInput"/> <button @click="search()">Search</button>
      </div>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { IChat, ISession, IUser, Session } from '@chat/shared';

import { API_URL } from '../shared';
import { getUserByUsername } from '../user';

@Component({})
export default class extends Vue {
  private selectedSession: ISession = {} as ISession;
  private selectedUser: IUser = {} as IUser;

  private message: string = '';
  private userSearchInput: string = '';

  private created() {
    this.$store.dispatch('getSessions');
  }

  get sessions() {
    return this.$store.getters.sessions;
  }

  get chats() {
    if (!this.selectedSession.sessionId) {
      return;
    }
    return this.$store.getters.chats[this.selectedSession.sessionId].chats.sort((chatA: IChat, chatB: IChat) => {
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
      this.selectSession(this.sessions[0]);
    }
  }

  private async search() {
    const user = await getUserByUsername(this.userSearchInput);
    if (!user) {
      alert('no such user');
      return;
    }

    // search sessions for user
    const sessionWithUser = this.sessions.filter((session: ISession) => {
      if (session.type !== 'regular') {
        return;
      }
      return session.users[0].username === user.username;
    })[0];

    if (sessionWithUser) {
      this.selectSession(sessionWithUser);
      return;
    }

    const newSession = Session.createSession('regular', this.$store.getters.user.userId, [user]);
    this.$store.dispatch('addSession', newSession);
    this.selectSession(newSession);
  }

  private selectSession(session: ISession) {
    this.selectedSession = session;
    this.selectedUser = this.selectedSession.users[0];
    this.$store.dispatch('getChats', this.selectedSession);
  }

  private displayUsers(session: ISession) {
    return session.users.map((user: any) => user.name).join(',');
  }

  private displayName(id: string) {
    if (id === this.selectedUser.userId) {
      return this.selectedUser.name;
    }

    if (id === this.$store.getters.user.userId) {
      return this.$store.getters.user.name;
    }
  }

  private sendMessage() {
    if (!this.message) {
      return;
    }
    this.$store.dispatch('sendChat', {
      message: this.message,
      session: this.selectedSession,
    });
    this.message = '';
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
