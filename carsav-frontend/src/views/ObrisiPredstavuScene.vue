<template>
  <div class="form-container">
    <div class="form-grid">
      <label class="form-label">Izaberi predstavu za brisanje:</label>
      <select class="form-input" v-model="predstavaIdZaBrisanje">
        <option :value="null" disabled>Izaberi predstavu</option>
        <option v-for="predstava in svePredstave" :key="predstava.Id" :value="predstava.Id">
          {{ predstava.Naziv }}
        </option>
      </select>
    </div>
    <div class="button-group">
      <button class="styled-button" @click="obrisiPredstavu">Obriši</button>
      <button class="styled-button" @click="goBack">Otkaži</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ObrisiPredstavuScene',
  data() {
    return {
      svePredstave: [],
      predstavaIdZaBrisanje: null
    };
  },
  async mounted() {
    try {
      const response = await fetch('https://carsav-api.onrender.com/api/predstave');
      this.svePredstave = await response.json();
    } catch (error) {
      console.error('Greška pri učitavanju predstava:', error);
    }
  },
  methods: {
    goBack() {
      this.$router.push('/main');
    },
    async obrisiPredstavu() {
      if (!this.predstavaIdZaBrisanje) {
        alert('Molimo izaberite predstavu za brisanje.');
        return;
      }
      if (confirm('Da li ste sigurni da želite da obrišete ovu predstavu?')) {
        try {
          await fetch(`https://carsav-api.onrender.com/api/predstave/${this.predstavaIdZaBrisanje}`, {
            method: 'DELETE'
          });
          this.goBack();
        } catch (error) {
          console.error('Greška pri brisanju predstave:', error);
          alert('Došlo je do greške.');
        }
      }
    }
  }
}
</script>

<style scoped>
/* Styles remain the same */
.form-container { display: flex; flex-direction: column; gap: 30px; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 600px; }
.form-grid { display: grid; grid-template-columns: auto 1fr; gap: 20px; align-items: center; }
.form-label { font-size: 16px; font-weight: bold; }
.form-input { background-color: #f2f2f2; border: 1px solid #c8102e; border-radius: 5px; padding: 10px 15px; font-size: 14px; }
.button-group { display: flex; justify-content: flex-start; gap: 20px; padding-left: 235px; }
.styled-button { background-color: #c8102e; color: white; font-size: 16px; font-weight: bold; padding: 12px 25px; border: none; border-radius: 10px; cursor: pointer; }
</style>