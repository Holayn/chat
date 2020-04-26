import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {} as any,
  },
  mutations: {
    user(state, userInfo) {
      state.user = userInfo;
    },
  },
  getters: {
    user: (state) => {
      return state.user;
    },
    hasUser: (state) => {
      return state.user.hasOwnProperty('userId');
    },
  },
  actions: {
    setUser({commit}, userInfo: any) {
      commit('user', userInfo);
    },
  },
});
