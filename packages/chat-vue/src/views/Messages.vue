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
                <th class="text-center">Friends <div v-if="isLoadingSessions">
                  loading
                </div></th>
              </tr>
            </thead>
            <tbody>
              <tr class="session-card" v-for="(session, i) in sessions" :key="i" @click="selectSession(session)">
                <td class="text-left"> {{ displayUsersInSession(session) }} </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-col>
      <v-col cols="8" class="chat-section">
        <div v-if="isLoadingChats">
          loading
        </div>
        <div class="chat-card" v-for="chat in chats" :key="chat.chatId" :style="{
          color: chatColor(chat.sent),
        }">
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

  // Inputs
  private message: string = '';
  private userSearchInput: string = '';

  // State
  private isLoadingSessions: boolean = false;
  private isLoadingChats: boolean = false;

  @Watch('hasUser', {immediate: true})
  public async onHasUserUpdated(hasUser: boolean) {
    this.isLoadingSessions = true;
    await this.$store.dispatch('getSessions');
    this.isLoadingSessions = false;

    if (!this.isSessionSelected) {
      this.selectSession(this.sessions[0]);
    }
  }

  get hasUser() {
    return this.$store.getters.hasUser;
  }

  get sessions() {
    return this.$store.getters.sessions;
  }

  get isSessionSelected() {
    return this.selectedSession.hasOwnProperty('sessionId');
  }

  get chats() {
    if (!this.isSessionSelected) {
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

  private async selectSession(session: ISession) {
    if (!session) {
      return;
    }
    this.selectedSession = session;
    this.loadChats();
  }

  private async loadChats() {
    this.isLoadingChats = true;
    await this.$store.dispatch('getChats', this.selectedSession);
    this.isLoadingChats = false;
  }

  private displayUsersInSession(session: ISession) {
    return session.users.map((user: any) => user.name).join(',');
  }

  private displayName(id: string) {
    const otherSessionUser = this.selectedSession.users[0];
    if (id === otherSessionUser.userId) {
      return otherSessionUser.name;
    }

    if (id === this.$store.getters.user.userId) {
      return this.$store.getters.user.name;
    }
  }

  private chatColor(sent: boolean | undefined) {
    if (sent === true || sent === undefined) {
      return 'black';
    }
    return 'lightgrey';
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
