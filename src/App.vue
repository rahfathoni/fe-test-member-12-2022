<template>
  <q-layout class="bg-grey-2 cstm-text-grey" view="hHh lpR fFf">
    <q-page-container class="row justify-center q-pt-xl">
      <div class="row items-start">
        <q-card
          flat
          bordered
          class="cstm-border-card"
          style="width: 300px; height: auto"
        >
          <q-card-section class="text-right q-mx-md">
            <div
              style="font-size: 18px; word-wrap: break-word; min-height: 28px"
            >
              {{ showCal }}
            </div>
          </q-card-section>

          <q-card-section class="row q-pt-md text-right q-mx-md">
            <div class="col-1" style="font-size: 40px">
              {{ isResult ? "=" : "" }}
            </div>
            <div
              class="col-11"
              style="font-size: 40px; min-height: 60px; word-wrap: break-word"
            >
              {{ showInput }}
            </div>
          </q-card-section>

          <q-separator class="q-mx-lg" inset />

          <q-card-section class="q-ml-none q-mr-md q-mb-md">
            <div class="fit row justify-between">
              <div class="col-6 text-right">
                <q-btn
                  flat
                  rounded
                  size="lg"
                  class="cstm-button-cyan q-ml-md"
                  label="C L E A R"
                  style="width: 120px"
                  @click.prevent="reset"
                />
              </div>
              <div class="col-3">
                <q-btn
                  flat
                  round
                  class="cstm-button-yellow q-ml-md cstm-btn-small"
                  @click.prevent="insert(buttonList[0])"
                  ><span style="font-size: 21px">%</span>
                </q-btn>
              </div>
              <div class="col-3">
                <q-btn
                  flat
                  round
                  class="cstm-button-yellow q-ml-md cstm-btn-small"
                  @click.prevent="insert(buttonList[1])"
                  ><span style="font-size: 21px">x</span>
                </q-btn>
              </div>
              <div
                v-for="item in buttonList.slice(2)"
                :key="item"
                class="col-3"
              >
                <q-btn
                  flat
                  round
                  :class="buttonColor(item)"
                  @click.prevent="insert(item)"
                  ><span style="font-size: 30px">{{ item.value }}</span>
                </q-btn>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

export default {
  name: "LayoutDefault",
  setup() {
    const store = useStore();

    // DATA
    const input = ref("");
    const showInput = ref("");
    const calHistory = ref([]);
    const showCal = ref("");
    const isResult = ref(false);

    // COMPUTED
    const inputHistory = computed(() => {
      return store.getters["getInputHistory"];
    });
    const buttonList = computed(() => {
      return store.getters["getButtonList"];
    });

    // METHOD
    const reset = () => {
      input.value = "";
      showInput.value = "";
      calHistory.value = [];
      showCal.value = "";
      isResult.value = false;
      store.commit("resetInputHistory");
    };
    const buttonColor = (val) => {
      if (val && val.isSymbol) {
        return "cstm-button-yellow q-ml-md q-mt-sm cstm-btn-small";
      }
      return "cstm-button-cyan q-ml-md q-mt-sm cstm-btn-small";
    };
    const insert = (val) => {
      isResult.value = false;
      if (val.isOperator) {
        if (
          showInput.value &&
          showInput.value[showInput.value.length - 1] === "."
        ) {
          showInput.value = showInput.value.toString().slice(0, -1);
        }
        if (
          inputHistory.value &&
          (showInput.value[showInput.value.length - 1] === "+" ||
            showInput.value[showInput.value.length - 1] === "-" ||
            showInput.value[showInput.value.length - 1] === "/" ||
            showInput.value[showInput.value.length - 1] === "x")
        ) {
          store.commit("setLastInputHistory", val.value);
          const _removeLast = showInput.value.toString().slice(0, -1);
          switch (val.label) {
            case "tambah":
              showInput.value = `${_removeLast}+`;
              break;
            case "kurang":
              showInput.value = `${_removeLast}-`;
              break;
            case "kali":
              showInput.value = `${_removeLast}x`;
              break;
            case "bagi":
              showInput.value = `${_removeLast}/`;
              break;
          }
          return;
        }
        if (!input.value) {
          return;
        }
        const _searchLast = searchLastOperator(showInput.value) || "";
        if (
          input.value &&
          input.value[0] === "-" &&
          isNaN(showInput.value) &&
          _searchLast &&
          _searchLast[_searchLast.length - 2] !== "/" &&
          _searchLast[_searchLast.length - 2] !== "x"
        ) {
          store.commit(
            "setInputHistory",
            parseFloat(input.value.toString().substring(1))
          );
        } else {
          store.commit("setInputHistory", parseFloat(input.value));
        }
        // Addition
        if (val.label === "tambah") {
          addition(val);
          return;
        }
        // Subtraction
        if (val.label === "kurang") {
          subtraction(val);
          return;
        }
        // Multiplication
        if (val.label === "kali") {
          multiplication(val);
          return;
        }
        // Division
        if (val.label === "bagi") {
          division(val);
          return;
        }
        // Result
        if (val.label === "hasil") {
          const count = eval(inputHistory.value);
          showInput.value = count;
          input.value = count;
          showCal.value = inputHistory.value.replaceAll("*", "x");
          store.commit("resetInputHistory");
          isResult.value = true;
        }
      }
      if (!val.isOperator) {
        // Decimal
        if (val.label === "titik") {
          decimal(val);
          return;
        }
        // Percent
        if (val.label === "persen") {
          percent();
          return;
        }
        // PlusMinus
        if (val.label === "plusmin") {
          plusMinus();
          return;
        }
        input.value = `${input.value}${val.value}`;
        showInput.value = `${showInput.value}${val.value}`;
        return;
      }
    };
    const searchLastOperator = (item) => {
      item = item ? item.toString() : "";
      const reverse = item.split("").reverse();
      const operatorIndex = reverse.findIndex((x) => x !== "." && isNaN(x));
      const removeLastInput = item.slice(0, item.length - operatorIndex);
      return removeLastInput;
    };
    const decimal = (val) => {
      const checkComa = input.value.toString();
      if (checkComa.includes(".") || !checkComa) {
        return;
      }
      input.value = `${input.value}${val.value}`;
      showInput.value = `${showInput.value}${val.value}`;
      return;
    };
    const percent = () => {
      const checkPercent = input.value.toString();
      if (checkPercent.includes("%") || !checkPercent) {
        return;
      }
      input.value = `${parseFloat(input.value) / 100}`;
      if (!isNaN(showInput.value)) {
        showInput.value = input.value;
        return;
      }
      const res = searchLastOperator(showInput.value);
      showInput.value =
        input.value[0] === "-"
          ? `${res}${input.value.toString().substring(1)}`
          : `${res}${input.value}`;
      return;
    };
    const plusMinus = () => {
      const checkInput = input.value.toString();
      if (!checkInput) {
        return;
      }
      const isMinus = parseFloat(input.value) < 0;
      input.value = isMinus
        ? input.value.toString().substring(1)
        : `-${input.value}`;
      const _show = showInput.value;
      if (!isNaN(_show)) {
        showInput.value = input.value;
        return;
      }
      const lastOperator = searchLastOperator(showInput.value) || "";
      if (
        lastOperator &&
        (lastOperator[lastOperator.length - 1] === "/" ||
          lastOperator[lastOperator.length - 2] === "/" ||
          lastOperator[lastOperator.length - 1] === "x" ||
          lastOperator[lastOperator.length - 2] === "x")
      ) {
        showInput.value =
          lastOperator[lastOperator.length - 1] === "-"
            ? `${lastOperator.toString().slice(0, -1)}${input.value}`
            : `${lastOperator}${input.value}`;
        return;
      }
      if (
        lastOperator &&
        (lastOperator[lastOperator.length - 1] === "+" ||
          lastOperator[lastOperator.length - 1] === "-")
      ) {
        const lastNumber = lastOperator.slice(0, -1);
        const newOperator =
          lastOperator[lastOperator.length - 1] === "-" ? "+" : "-";
        store.commit("setLastInputHistory", newOperator);
        if (
          (lastOperator[lastOperator.length - 1] === "-" &&
            !isNaN(input.value[0])) ||
          (lastOperator[lastOperator.length - 1] === "+" &&
            input.value[0] === "-")
        ) {
          showInput.value =
            newOperator === "+"
              ? `${lastNumber}+${input.value}`
              : `${lastNumber}${input.value}`;
        }
        if (
          (lastOperator[lastOperator.length - 1] === "-" &&
            input.value[0] === "-") ||
          (lastOperator[lastOperator.length - 1] === "+" &&
            !isNaN(input.value[0]))
        )
          showInput.value =
            input.value[0] === "-"
              ? `${lastNumber}+${input.value.toString().substring(1)}`
              : `${lastNumber}-${input.value}`;
        return;
      }
    };
    const addition = (val) => {
      store.commit("setInputHistory", val.value);
      showInput.value = `${showInput.value}+`;
      input.value = "";
      return;
    };
    const subtraction = (val) => {
      store.commit("setInputHistory", val.value);
      showInput.value = `${showInput.value}-`;
      input.value = "";
      return;
    };
    const multiplication = (val) => {
      store.commit("setInputHistory", val.value);
      showInput.value = `${showInput.value}x`;
      input.value = "";
      return;
    };
    const division = (val) => {
      store.commit("setInputHistory", val.value);
      showInput.value = `${showInput.value}/`;
      input.value = "";
      return;
    };

    return {
      input,
      showInput,
      showCal,
      inputHistory,
      isResult,
      buttonList,
      buttonColor,
      reset,
      insert,
    };
  },
};
</script>

<style scoped>
.cstm-btn-small {
  height: 52px;
  width: 52px;
  font-size: 17px;
}
</style>
