import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
  },
  mutations: {
    user(state, payload) {
      state.user = payload.user;
    },
  },
  actions: {
    setUser({commit}, userInfo: any) {
      commit('user', userInfo);
    },
  },
});
