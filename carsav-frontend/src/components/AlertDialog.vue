<template>
  <!-- The backdrop covers the whole screen. We only show it if the 'isVisible' prop is true. -->
  <div v-if="isVisible" class="modal-backdrop" @click="close">
    <!-- We use @click.stop to prevent a click inside the modal from closing it. -->
    <div class="modal-content" @click.stop>
      <!-- Modal Header with Title and Icon -->
      <div class="modal-header" :class="type">
        <span class="icon">{{ type === 'warning' ? '⚠️' : 'ℹ️' }}</span>
        <h3>{{ title }}</h3>
      </div>

      <!-- Modal Body with the Message -->
      <div class="modal-body">
        <!-- The 'pre-wrap' style ensures that newline characters (\n) create new lines -->
        <p style="white-space: pre-wrap;">{{ message }}</p>
      </div>

      <!-- Modal Footer with the OK button -->
      <div class="modal-footer">
        <button class="styled-button" @click="close">OK</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlertDialog',
  // These are the properties the parent component will pass to us.
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    // 'type' will control the color and icon (e.g., 'info', 'warning')
    type: {
      type: String,
      default: 'info', // Default to 'info' if not provided
    },
  },
  methods: {
    close() {
      // When the user clicks OK or the backdrop, we emit a 'close' event.
      // The parent component will listen for this event to hide the modal.
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  overflow: hidden; /* Ensures the header color doesn't bleed out */
}

.modal-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  color: white;
  background-color: #337ab7; /* Default info color */
}
.modal-header.warning {
  background-color: #f0ad4e; /* Warning color */
}
.modal-header h3 {
  margin: 0;
  font-size: 1.25rem;
}
.icon {
  font-size: 1.5rem;
}

.modal-body {
  padding: 20px;
  font-size: 1rem;
  line-height: 1.5;
}

.modal-footer {
  padding: 15px 20px;
  text-align: right;
  border-top: 1px solid #e5e5e5;
}

.styled-button {
  background-color: #c8102e;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 25px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}
</style>
