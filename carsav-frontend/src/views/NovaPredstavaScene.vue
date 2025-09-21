<template>
  <div class="form-container">
    <div class="form-grid">
      <label for="naziv" class="form-label">Naziv predstave:</label>
      <input type="text" id="naziv" class="form-input" v-model="nazivPredstave" />

      <label for="glumci" class="form-label">Izaberi glumce:</label>
      <select id="glumci" class="form-input" v-model="selektovaniGlumacId">
        <option :value="null" disabled>Izaberi glumca</option>
        <option v-for="glumac in sviGlumci" :key="glumac.Id" :value="glumac.Id">
          {{ glumac.Ime }} {{ glumac.Prezime }}
        </option>
      </select>
    </div>

    <div class="button-group-large">
      <button class="styled-button large-button" @click="dodajGlumca">Dodaj izabranog glumca</button>
    </div>

    <!-- This section will display the selected actors -->
    <div class="selected-actors-list" v-if="izabraniGlumci.length > 0">
      <h4>Izabrani glumci:</h4>
      <ul>
        <li v-for="glumac in izabraniGlumci" :key="glumac.Id">
          <span>{{ glumac.Ime }} {{ glumac.Prezime }}</span>
          <button class="remove-btn" @click="ukloniGlumca(glumac.Id)">X</button>
        </li>
      </ul>
    </div>

    <div class="button-group-small">
      <button class="styled-button" @click="sacuvajPredstavu">Sačuvaj</button>
      <button class="styled-button" @click="goBack">Otkaži</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NovaPredstavaScene',
  data() {
    return {
      sviGlumci: [],
      izabraniGlumci: [], // List of actor objects that have been selected
      selektovaniGlumacId: null, // The ID of the actor currently selected in the dropdown
      nazivPredstave: ''
    };
  },
  async mounted() {
    try {
      const response = await fetch('http://localhost:3000/api/glumci');
      this.sviGlumci = await response.json();
    } catch (error) {
      console.error('Greška pri učitavanju glumaca:', error);
    }
  },
  methods: {
    goBack() {
      this.$router.push('/main');
    },
    dodajGlumca() {
      if (!this.selektovaniGlumacId) return;

      // Check if actor is already added
      if (this.izabraniGlumci.some(g => g.Id === this.selektovaniGlumacId)) {
        alert('Ovaj glumac je već dodat.');
        return;
      }

      const glumacToAdd = this.sviGlumci.find(g => g.Id === this.selektovaniGlumacId);
      if (glumacToAdd) {
        this.izabraniGlumci.push(glumacToAdd);
      }
    },
    ukloniGlumca(glumacId) {
      this.izabraniGlumci = this.izabraniGlumci.filter(g => g.Id !== glumacId);
    },
    async sacuvajPredstavu() {
      if (!this.nazivPredstave) {
        alert('Molimo unesite naziv predstave.');
        return;
      }
      try {
        const payload = {
          Naziv: this.nazivPredstave,
          glumciIds: this.izabraniGlumci.map(g => g.Id) // Extract just the IDs
        };

        await fetch('http://localhost:3000/api/predstave', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        this.goBack();
      } catch (error) {
        console.error('Greška pri čuvanju predstave:', error);
        alert('Došlo je do greške.');
      }
    }
  }
}
</script>

<style scoped>
/* Styles are mostly the same, with additions for the list */
.form-container { display: flex; flex-direction: column; gap: 20px; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 600px; }
.form-grid { display: grid; grid-template-columns: auto 1fr; gap: 15px; align-items: center; }
.form-label { font-size: 16px; font-weight: bold; text-align: right; }
.form-input { background-color: #f2f2f2; border: 1px solid #c8102e; border-radius: 5px; padding: 10px 15px; font-size: 14px; }
.button-group-large, .button-group-small { display: flex; gap: 20px; padding-left: 145px; }
.styled-button { background-color: #c8102e; color: white; font-size: 16px; font-weight: bold; padding: 12px 25px; border: none; border-radius: 10px; cursor: pointer; }
.large-button { padding: 15px 30px; width: 100%; max-width: 300px; }
.selected-actors-list { padding-left: 145px; }
.selected-actors-list ul { list-style: none; padding: 0; }
.selected-actors-list li { display: flex; justify-content: space-between; align-items: center; padding: 5px; background-color: #f5f5f5; border-radius: 5px; margin-bottom: 5px; }
.remove-btn { background-color: #333; color: white; border: none; border-radius: 50%; cursor: pointer; width: 20px; height: 20px; line-height: 20px; text-align: center; }
</style>