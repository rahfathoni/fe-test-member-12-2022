<template>
  <q-layout class="bg-grey-2 cstm-text-grey" view="hHh lpR fFf">
    <q-page-container
      :class="'q-pt-xl ' + ($q.screen.lt.sm ? '' : 'q-ml-xl q-pl-xl')"
    >
      <div class="row items-start">
        <q-card
          flat
          bordered
          class="cstm-border-card"
          style="width: 300px; height: auto"
        >
          <q-card-section class="text-right q-mx-md">
            <div
              style="font-size: 18px; word-wrap: break-word; min-height: 20px"
            >
              {{ showCal }}
            </div>
          </q-card-section>

          <q-card-section class="q-pt-md text-right q-mx-md">
            <div
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
                  @click="reset"
                />
              </div>
              <div class="col-3">
                <q-btn
                  flat
                  round
                  class="cstm-button-yellow q-ml-md cstm-btn-small"
                  ><span style="font-size: 21px">%</span>
                </q-btn>
              </div>
              <div class="col-3">
                <q-btn
                  flat
                  round
                  class="cstm-button-yellow q-ml-md cstm-btn-small"
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
    const calculation = ref(0);
    const calHistory = ref([]);
    const showCal = ref("");

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
      calculation.value = 0;
      calHistory.value = [];
      showCal.value = "";
      store.commit("resetInputHistory");
    };
    const buttonColor = (val) => {
      if (val && val.isSymbol) {
        return "cstm-button-yellow q-ml-md q-mt-sm cstm-btn-small";
      }
      return "cstm-button-cyan q-ml-md q-mt-sm cstm-btn-small";
    };
    const insert = (val) => {
      if (val.isOperator) {
        if (!input.value) {
          return;
        }
        store.commit("setInputHistory", parseFloat(input.value));
        // plus
        if (val.label === "tambah") {
          store.commit("setInputHistory", val.value);
          showInput.value = `${showInput.value}+`;
          calculation.value =
            parseFloat(calculation.value) + parseFloat(input.value);
          input.value = "";
          return;
        }
        // minus
        if (val.label === "kurang") {
          store.commit("setInputHistory", val.value);
          showInput.value = `${showInput.value}-`;
          calculation.value =
            parseFloat(calculation.value) - parseFloat(input.value);
          input.value = "";
          return;
        }

        // times

        // divide

        // result
        if (val.label === "hasil") {
          const count = eval(inputHistory.value);
          showInput.value = count;
          input.value = count;
          showCal.value = inputHistory.value;
          store.commit("resetInputHistory");
        }
      }
      if (!val.isOperator) {
        // // decimal
        // if (val.label === "titik") {
        //   const checkComa = input.value.toString();
        //   if (checkComa.includes(".") || !checkComa) {
        //     return;
        //   }
        //   input.value = `${input.value}${val.value}`;
        //   showInput.value = `${showInput.value}${val.value}`;
        //   return;
        // }
        // // percent
        // if (val.label === "persen") {
        //   const checkPercent = input.value.toString();
        //   if (checkPercent.includes("%") || !checkPercent) {
        //     return;
        //   }
        //   input.value = `${parseFloat(input.value) / 100}`;
        //   showInput.value = `${showInput.value}${input.value}`;
        //   return;
        // }
        // // plus or minus
        // if (val.label === "plusmin") {
        //   input.value =
        //     parseFloat(input.value) < 0
        //       ? input.value.toString().substring(1)
        //       : `-${input.value}`;
        //   showInput.value = `${showInput.value}${input.value}`;
        //   return;
        // }
        input.value = `${input.value}${val.value}`;
        showInput.value = `${showInput.value}${val.value}`;
        return;
      }
    };

    return {
      input,
      showInput,
      showCal,
      inputHistory,
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
