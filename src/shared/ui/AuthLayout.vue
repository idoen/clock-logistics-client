<template>
  <div class="auth-page" dir="rtl">
    <main class="auth-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem 1.5rem;
}

.auth-content {
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>
