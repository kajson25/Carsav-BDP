<template>
  <div class="form-container">
    <div class="form-grid">
      <label for="ime" class="form-label">Ime:</label>
      <input type="text" id="ime" class="form-input" v-model="ime" />

      <label for="prezime" class="form-label">Prezime:</label>
      <input type="text" id="prezime" class="form-input" v-model="prezime" />
    </div>
    <div class="button-group">
      <button class="styled-button" @click="dodajGlumca">Dodaj</button>
      <button class="styled-button" @click="goBack">Otkaži</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NovGlumacScene',
  data() {
    return {
      ime: '',
      prezime: ''
    };
  },
  methods: {
    goBack() {
      this.$router.push('/main');
    },
    async dodajGlumca() {
      if (!this.ime || !this.prezime) {
        alert('Molimo unesite i ime i prezime.');
        return;
      }
      try {
        await fetch('https://carsav-api.onrender.com/api/glumci', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Ime: this.ime, Prezime: this.prezime })
        });
        this.goBack(); // Navigate back to main screen on success
      } catch (error) {
        console.error('Greška pri dodavanju glumca:', error);
        alert('Došlo je do greške.');
      }
    }
  }
}
</script>

<style scoped>
/* Styles remain the same */
.form-container { display: flex; flex-direction: column; gap: 30px; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 500px; }
.form-grid { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: center; }
.form-label { font-size: 20px; font-weight: bold; text-align: right; }
.form-input { background-color: #f2f2f2; border: 1px solid #c8102e; border-radius: 5px; padding: 10px 15px; font-size: 14px; }
.button-group { display: flex; justify-content: flex-start; gap: 20px; grid-column: 1 / -1; padding-left: 115px; }
.styled-button { background-color: #c8102e; color: white; font-size: 16px; font-weight: bold; padding: 12px 25px; border: none; border-radius: 10px; cursor: pointer; }
</style>