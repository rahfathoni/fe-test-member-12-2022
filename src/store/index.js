import { createStore } from "vuex";

export default createStore({
  state: {
    inputHistory: "",
    buttonList: [
      { label: "persen", value: "%", isOperator: false, isSymbol: true },
      { label: "kali", value: "*", isOperator: true, isSymbol: true },
      { label: "1", value: "1", isOperator: false, isSymbol: false },
      { label: "2", value: "2", isOperator: false, isSymbol: false },
      { label: "3", value: "3", isOperator: false, isSymbol: false },
      { label: "bagi", value: "/", isOperator: true, isSymbol: true },
      { label: "4", value: "4", isOperator: false, isSymbol: false },
      { label: "5", value: "5", isOperator: false, isSymbol: false },
      { label: "6", value: "6", isOperator: false, isSymbol: false },
      { label: "tambah", value: "+", isOperator: true, isSymbol: true },
      { label: "7", value: "7", isOperator: false, isSymbol: false },
      { label: "8", value: "8", isOperator: false, isSymbol: false },
      { label: "9", value: "9", isOperator: false, isSymbol: false },
      { label: "kurang", value: "-", isOperator: true, isSymbol: true },
      { label: "plusmin", value: "+/-", isOperator: false, isSymbol: true },
      { label: "0", value: "0", isOperator: false, isSymbol: false },
      { label: "titik", value: ".", isOperator: false, isSymbol: true },
      { label: "hasil", value: "=", isOperator: true, isSymbol: true },
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
      if (!data) {
        state.inputHistory = val;
        return;
      }
      state.inputHistory = `${data} ${val}`;
    },
    setLastInputHistory(state, val) {
      console.log("MUT VALL =>", val);
      let data = state.inputHistory;
      console.log("MUT DAT =>", data);
      if (data) {
        data = data.slice(0, -1);
        console.log("MUT SLICE =>", val);
        state.inputHistory = `${data} ${val}`;
        console.log("MUT LAS =>", state.inputHistory);
      }
    },
  },
  actions: {},
  modules: {},
});
