<template>
  <div id="app-container">
    <!-- The Router will inject the current page component here -->
    <router-view />
  </div>
</template>

<style>
/* Global styles for our application */
body {
  margin: 0;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f2f2f2; /* Light grey background like in your app */
}

#app-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box; /* Ensures padding doesn't add to the width/height */
}
</style>