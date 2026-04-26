<template>
  <div class="app-layout">
    <NuxtRouteAnnouncer />

    <main class="app-layout__container">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </main>
  </div>
</template>

<style lang="scss">
@use '~/assets/scss/variables' as vars;

// Reset & Base Styles
html,
body {
  margin: 0;
  padding: 0;
  font-family: vars.$font-family-base;
  background-color: vars.$color-canvas;
  color: vars.$color-text;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

* {
  box-sizing: border-box;
}

// BEM Layout Wrapper
.app-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: vars.$spacing-xl vars.$spacing-md;

  &__container {
    width: 100%;
    max-width: 600px;
    background-color: vars.$color-surface;
    border-radius: vars.$border-radius-xl;
    box-shadow: vars.$shadow-level-1;
    padding: vars.$spacing-xl;
    transition: box-shadow 0.3s ease;
  }
}
</style>
