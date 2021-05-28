<template>
  <section class="myButton">
    <button @mouseover="over" :class="type">
      <slot></slot>
    </button>
    <p>name:{{ name }}</p>
    <p>job:{{ job }}</p>
  </section>
</template>

<script>
import { defineComponent, inject } from "vue";

export default defineComponent({
  name: "MyButton",
  emits: {
    customHandler: (str) => {
      if (typeof str === "string") {
        console.log(str);
        return true;
      }
      console.warn("customHandler must be a string!");
      return false;
    },
  },
  setup(props, ctx) {
    const name = inject("name");
    const job = inject("job");
    const over = () => {
      ctx.emit("customHandler", "我是参数");
      ctx.emit("customHandler", 123);
    };
    return {
      over,
      name,
      job,
    };
  },
  props: {
    type: {
      type: String,
    },
  },
});
</script>

<style lang="scss" scoped>
.myButton {
  button {
    &.primary {
      background-color: #0f0;
    }
    &.warning {
      background-color: orange;
    }
    &.error {
      background-color: #f00;
    }
    &.info {
      background-color: #ccc;
    }
  }
}
</style>