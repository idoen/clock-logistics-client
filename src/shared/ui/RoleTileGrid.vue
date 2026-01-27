<template>
  <section class="role-grid">
    <slot />
  </section>
</template>

<style scoped>
.role-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  width: min(520px, 100%);
}
</style>
