import { createStore } from 'vuex';

export default createStore({
  state: {
    token: localStorage.getItem('token') || null,
    user: null
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      localStorage.setItem('token', token);
    },
    CLEAR_TOKEN(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
    SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    login({ commit }, token) {
      commit('SET_TOKEN', token);
    },
    logout({ commit }) {
      commit('CLEAR_TOKEN');
    },
    setUser({ commit }, user) {
      commit('SET_USER', user);
    }
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
    token: (state) => state.token
  }
});