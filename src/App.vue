<template>
  <section class="app">
      <input type="text" v-model="name" placeholder="请输入名字">
      <button @click="alertName">弹出名字</button>
      <button @click="alertId">弹出id</button>
      <h1>id:{{id}}-name:{{name}}---age:{{age}}</h1>
      <h1 ref="introduction">{{sayHi('男')}}</h1>
      <my-button type="info">我是按钮</my-button>
  </section>
</template>

<script>
import { defineComponent, defineAsyncComponent, ref, reactive, toRefs, computed, watch } from 'vue'
export default defineComponent({
  name: 'App',
  components: {
    MyButton: defineAsyncComponent(()=>import('@/components/myButton')),
  },
  setup(){
    const id = ref(1);
    const user = reactive({
      name: 'Suk',
      age: 18,
    })    
    const alertName = () => {
      alert(user.name);
      user.name = 123;
    }
    const alertId = () =>{
      alert(id.value);
    }
    const sayHi = computed(() => {
      return gender => {
        return `${user.name}的性别是${gender},今年${user.age}岁`;
      };
    });
    const introduction = ref(null);
    watch(user, ()=>{
      console.log(introduction.value.textContent)
    })
    return {
      id,
      ...toRefs(user),
      alertName,
      alertId,
      sayHi,
      introduction
    }
  }
})
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
