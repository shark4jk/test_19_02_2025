<script setup>
import dice from './components/dice.vue';
</script>

<template>
  <div style="height: 100vh;" :class="'font-'+fontStore.fonts">
  <dice/>
  </div>
</template>

<style scoped>

</style>
