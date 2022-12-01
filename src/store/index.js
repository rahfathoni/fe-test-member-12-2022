import { createStore } from "vuex";

export default createStore({
  state: {
    inputHistory: [],
    buttonList: [
      { label: "kali", value: "*", isOperator: true },
      { label: "1", value: "1", isOperator: false },
      { label: "2", value: "2", isOperator: false },
      { label: "3", value: "3", isOperator: false },
      { label: "tambah", value: "+", isOperator: true },
      { label: "4", value: "4", isOperator: false },
      { label: "5", value: "5", isOperator: false },
      { label: "6", value: "6", isOperator: false },
      { label: "kurang", value: "-", isOperator: true },
      { label: "7", value: "7", isOperator: false },
      { label: "8", value: "8", isOperator: false },
      { label: "9", value: "9", isOperator: false },
      { label: "persen", value: "%", isOperator: true },
      { label: "plusmin", value: "plusmin", isOperator: true },
      { label: "0", value: "0", isOperator: false },
      { label: "titik", value: ".", isOperator: true },
      { label: "hasil", value: "=", isOperator: true },
    ],
  },
  getters: {
    getInputHistory(state) {
      return state.inputHistory;
    },
    getButtonList(state) {
      return state.buttonList;
    },
  },
  mutations: {
    resetInputHistory(state) {
      state.inputHistory = [];
    },
    setInputHistory(state, val) {
      let data = state.inputHistory;
      data.push(val);
      state.inputHistory = data;
    },
  },
  actions: {},
  modules: {},
});
