<template>
  <section class="myButton">
      <button :class="type">
        <slot></slot>
      </button>
  </section>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: 'MyButton',
  props: {
    type: {
      type: String
    },
  }
})
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