<template>
  <section class="app">
    <input type="text" v-model="name" placeholder="请输入名字" />
    <button @click="alertName">弹出名字</button>
    <button @click="alertId">弹出id</button>
    <h1>id:{{ id }}-name:{{ name }}---age:{{ age }}</h1>
    <h1 ref="introduction">{{ sayHi("男") }}</h1>
    <my-button @click="btnClick" @customHandler="customHandler" :type="type"
      >我是按钮</my-button
    >
    <button @click="type = 'error'">变红色</button>
    <button @click="changeProvide">更改provide</button>
  </section>
</template>

<script>
import {
  defineComponent,
  defineAsyncComponent,
  ref,
  reactive,
  toRefs,
  computed,
  watch,
  provide
} from "vue";
export default defineComponent({
  name: "App",
  components: {
    // 异步组件
    // MyButton: defineAsyncComponent(()=>import('@/components/myButton')),
    MyButton: defineAsyncComponent({
      loader: () => import("@/components/myButton"),
    }),
  },
  setup() {
    let name = ref("Suk");
    let job = ref("webEnginner");
    provide("name", name);
    provide("job", job);
    const changeProvide = () => {
      name.value = 'Susuk';
      job.value = 'UI';
    }
    const customHandler = (args) => {
      console.log("自定义事件被触发了", args);
    };
    let type = ref("info");
    const id = ref(1);
    const user = reactive({
      name: "Suk",
      age: 18,
    });
    const alertName = () => {
      alert(user.name);
      user.name = 123;
    };
    const alertId = () => {
      alert(id.value);
    };
    const sayHi = computed(() => {
      return (gender) => {
        return `${user.name}的性别是${gender},今年${user.age}岁`;
      };
    });
    const btnClick = () => {
      console.log("点击了自定义按钮");
    };
    const introduction = ref(null);
    watch(user, () => {
      console.log(introduction.value.textContent);
    });
    return {
      id,
      ...toRefs(user),
      alertName,
      alertId,
      sayHi,
      introduction,
      type,
      btnClick,
      customHandler,
      changeProvide
    };
  },
});
</script>

<style lang="scss">
.app {
  padding-top: 100px;
  text-align: center;
  h1 {
    color: #666;
  }
}
</style>
