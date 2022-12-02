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
            <div style="font-size: 17px">{{ inputHistory }}</div>
          </q-card-section>

          <q-card-section class="q-pt-md text-right q-mx-md">
            <!-- <q-input
              v-model="input"
              class="text-right"
              style="font-size: 40px"
              borderless
              reverse-fill-mask
              disable
            /> -->
            <div
              style="font-size: 40px; min-height: 60px; word-wrap: break-word"
            >
              {{ input }}
            </div>
          </q-card-section>

          <q-separator class="q-mx-lg" inset />

          <q-card-section class="q-ml-none q-mr-md q-mb-md">
            <div class="fit row justify-between">
              <div class="col-9 text-right">
                <q-btn
                  flat
                  rounded
                  size="lg"
                  class="cstm-button-cyan q-ml-md"
                  label="C L E A R"
                  style="width: 175px"
                  @click="reset"
                />
              </div>
              <div class="col-3">
                <q-btn
                  flat
                  round
                  class="cstm-button-yellow q-ml-md text-weight-bold cstm-btn-small"
                  label="x"
                />
                <!-- bukan sebagai lable tapi mandiri -->
              </div>
              <div
                v-for="item in buttonList.slice(1)"
                :key="item"
                class="col-3"
              >
                <q-btn
                  flat
                  round
                  class="cstm-button-yellow q-ml-md text-weight-bold q-mt-sm cstm-btn-small"
                  :label="item.value"
                />
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
    const input = ref("test");
    const calculation = ref(0);

    // COMPUTED
    const inputHistory = computed(() => {
      // const test = ["23", "+", "13"];
      // return test.join(" ");
      const history = store.getters["getInputHistory"];
      if (history && history.length !== 0) {
        return history.join(" ");
      }
      return [];
    });

    const buttonList = computed(() => {
      return store.getters["getButtonList"];
    });

    //METHOD
    const reset = () => {
      input.value = "";
      calculation.value = 0;
      store.commit("resetInputHistory");
    };

    return {
      inputHistory,
      buttonList,
      input,
      reset,
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
