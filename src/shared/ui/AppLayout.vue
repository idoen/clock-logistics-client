<template>
  <div>
    <header style="background: white; border-bottom: 1px solid #e2e8f0; padding: 12px 24px;">
      <nav style="display: flex; gap: 16px; align-items: center;">
        <div style="font-weight: 800; font-size: 18px;">Clock Logistics</div>
        <RouterLink to="/dashboard">Dashboard</RouterLink>
        <RouterLink to="/reorder">Reorder</RouterLink>
        <RouterLink to="/purchase-orders">Purchase Orders</RouterLink>
      </nav>
    </header>
    <main style="padding: 16px 24px; max-width: 1400px; margin: 0 auto;">
      <slot />
    </main>
  </div>
</template>
