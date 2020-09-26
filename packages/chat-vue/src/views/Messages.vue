<template>
  <div class="messages-grid h-full">
    <div class="sidebar flex flex-col bg-gray-700">
      <div class="flex justify-end pt-3 pr-3">
        <div class="relative">
          <button
            class="relative z-50 inline-block text-sm leading-none border rounded text-white border-white hover:bg-opacity-50 hover:bg-white mt-4 lg:mt-0"
            @click="toggleUserSearch()"
            >
            <!-- https://iconsvg.xyz/ -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
          <button
            v-if="isUserSearchOpen"
            class="fixed inset-0 h-full w-full bg-black opacity-50 cursor-default"
            @click="toggleUserSearch()"
          ></button>
          <div class="absolute">
            <div class="flex p-3 space-x-3 bg-gray-900 rounded-lg" v-if="isUserSearchOpen">
              <input ref="userSearchInput" class="shadow appearance-none rounded py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="userSearchInput" placeholder="username">
              <button
                class="inline-block text-sm px-4 py-2 mt-4 leading-none border rounded text-white border-white hover:border-transparent hover:text-orange-500 hover:bg-white lg:mt-0"
                @click="search()">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="flex-grow space-y-3 p-3">
        <div v-if="isLoadingSessions" class="flex h-full w-full">
          <Loading class="item-center justify-center"/>
        </div>
        <div
          class="p-4 rounded-sm bg-gray-600 bg-opacity-50 hover:bg-opacity-75 transition duration-500 ease-out text-white"
          v-for="(session, i) in sessions"
          :key="i"
          @click="selectSession(session)">
          {{displayUsersInSession(session)}}<span v-if="!session.read">*</span>
        </div>
      </div>
    </div>
    <div class="chats space-y-3 p-3 bg-gray-800">
      <div v-if="isLoadingChats" class="flex h-full w-full">
        <Loading class="item-center justify-center"/>
      </div>
      <div
        class="bg-gray-700 bg-opacity-50 rounded-lg px-3 py-2"
        v-for="chat in chats"
        :key="chat.chatId"
        :class="chatColor(chat.sent)">
        <div>
          <span class="text-xl">{{displayName(chat.userId)}}</span>
          <span class="pl-2 text-xs">{{new Date(new Number(chat.timestamp))}}</span>
        </div>
        <div>
          {{chat.message}}
        </div>
      </div>
    </div>
    <div class="input flex items-center px-2 bg-gray-900">
      <div class="flex-auto pr-2">
        <input class="shadow appearance-none rounded w-full py-2 px-3 text-white bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" v-model="message" placeholder="Message">
      </div>
      <div>
        <button
          class="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-orange-500 hover:bg-white mt-4 lg:mt-0"
          @click="sendMessage()">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import { IChat, ISession, IUser, Session } from '@chat/shared';

import { API_URL } from '../shared';
import { getUserByUsername } from '../user';

import Loading from '../components/Loading.vue';

@Component({
  components: {
    Loading,
  }
})
export default class extends Vue {
  private selectedSession: ISession = {} as ISession;

  // Inputs
  private message: string = '';
  private userSearchInput: string = '';

  // State
  private isLoadingSessions: boolean = false;
  private isLoadingChats: boolean = false;
  private isUserSearchOpen: boolean = false;

  created() {
    window.addEventListener('keyup', this.onEnterPressed);
  }

  destroyed() {
    window.removeEventListener('keyup', this.onEnterPressed);
  }

  async mounted() {
    this.isLoadingSessions = true;
    await this.$store.dispatch('getSessions');
    this.isLoadingSessions = false;

    this.selectSession(this.sessions[0]);
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
      this.toggleUserSearch();
      return;
    }

    const newSession = Session.createSession('regular', this.$store.getters.user.userId, [user]);
    this.$store.dispatch('addSession', newSession);
    this.selectSession(newSession);
    this.toggleUserSearch();
  }

  private async selectSession(session: ISession) {
    if (!session) {
      return;
    }
    this.selectedSession = session;
    this.loadChats();

    this.$store.dispatch('readChats', this.selectedSession);
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
      return 'text-gray-100';
    }
    return 'text-gray-300';
  }

  private sendMessage() {
    if (!this.message) {
      return;
    }

    this.$store.dispatch('readChats', this.selectedSession);
    this.$store.dispatch('sendChat', {
      message: this.message,
      session: this.selectedSession,
    });
    this.message = '';
  }

  private onEnterPressed(key: KeyboardEvent) {
    if (key.code === 'Enter') {
      if (this.isUserSearchOpen) {
        this.search();
        return;
      }
      this.sendMessage();
    }
  }

  private toggleUserSearch() {
    this.isUserSearchOpen = !this.isUserSearchOpen;
    if (this.isUserSearchOpen) {
      this.$nextTick(() => {
        (this.$refs.userSearchInput as HTMLElement).focus();
      });
      return;
    }

    this.userSearchInput = '';
  }
}
</script>

<style lang="scss" scoped>
.messages-grid {
  display: grid;
  grid-template-rows: auto 50px;
  grid-template-columns: 25% 75%;
  grid-template-areas:
    "sidebar chats"
    "sidebar input";

  .sidebar {
    grid-area: sidebar;
  }

  .chats {
    grid-area: chats;
  }

  .input {
    grid-area: input;
  }
}
</style>
