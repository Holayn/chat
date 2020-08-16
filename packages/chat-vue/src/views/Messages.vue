<template>
  <div>
    <h1>Messages</h1>
    <div>
      <div>
        <div v-for="(session, i) in sessions" :key="i" @click="selectSession(session)">
          <span>
            {{displayUsers(session)}}
          </span>
        </div>
      </div>
      <div>
        <div v-for="(chat, i) in chats" :key="i">
          {{chat}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { API_URL } from '../shared';
import { getChats } from '../chat';
import { getUserById, IUser } from '../user';
import { ISession } from '../session';

export default defineComponent({
  data() {
    return {
      selectedSession: {},
      selectedUser: {},
    } as {
      selectedSession: ISession,
      selectedUser: IUser,
    }
  },
  created() {
    this.$store.dispatch('getSessions');
  },
  computed: {
    sessions() {
      return this.$store.getters.sessions;
    },
    chats() {
      return this.$store.getters.chats;
    },
  },
  watch: {
    sessions() {
      if (this.sessions.length !== 0 && Object.keys(this.selectedSession).length === 0) {
        this.getChats(this.sessions[0]);
      }
    }
  },
  methods: {
    selectSession(session: ISession) {
      this.selectedSession = session;
      this.getChats(session);
    },
    displayUsers(session: ISession) {
      return session.users.map((user: any) => user.name).join(',');
    },
    async getChats(session: ISession) {
      this.$store.dispatch('getChats', session['session-id']);
      this.selectedUser = await getUserById(session.users[0]['user-id']);
    },
  }
})
</script>

<style lang="scss" scoped>
</style>
