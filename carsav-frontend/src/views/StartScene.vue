<template>
  <div class="start-scene-container">
    <h1 class="title">Dobrodošli u BDP</h1>
    <button @click="goToMain" class="start-button">Počni</button>
  </div>
</template>

<script>
export default {
  name: 'StartScene',
  methods: {
    // This method will be called when the button is clicked
    goToMain() {
      // Use the router to navigate to the '/main' page
      this.$router.push('/main');
    }
  }
}
</script>

<style scoped>
.start-scene-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Align items to the left */
  justify-content: flex-start;
  padding: 40px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;
  min-height: 600px; /* Give it some height */
  box-sizing: border-box;
}

.title {
  font-size: 36px;
  font-weight: bold;
  color: #000000;
  margin: 0 0 20px 0; /* Margin bottom to space it from the button */
}

.start-button {
  background-color: #c8102e;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 15px 35px;
  border: none;
  border-radius: 10px; /* Slightly less rounded corners */
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-button:hover {
  background-color: #a10d24;
}
</style>