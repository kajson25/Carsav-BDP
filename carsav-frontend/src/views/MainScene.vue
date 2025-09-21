<template>
  <div class="main-scene-container">
    <!-- Top section with dropdowns -->
    <div class="action-box">
      <!-- First Dropdown -->
      <select class="combo-box" v-model="izabranaPredstava1">
        <option :value="null" disabled>Izaberi predstavu</option>
        <option v-for="predstava in svePredstave" :key="predstava.Id" :value="predstava.Id">
          {{ predstava.Naziv }}
        </option>
      </select>
      <!-- Second Dropdown -->
      <select class="combo-box" v-model="izabranaPredstava2">
        <option :value="null" disabled>Izaberi predstavu</option>
        <option v-for="predstava in svePredstave" :key="predstava.Id" :value="predstava.Id">
          {{ predstava.Naziv }}
        </option>
      </select>
    </div>

    
    <div class="action-box">
      <button class="styled-button" @click="proveriZaDve">Proveri za dve</button>
      <button class="styled-button" @click="listajSlobodne">Listaj slobodne</button>
    </div>

    <div class="action-box">
      <button class="styled-button" @click="$router.push('/nova-predstava')">Nova predstava</button>
      <button class="styled-button" @click="$router.push('/nov-glumac')">Nov glumac</button>
      <button class="styled-button" @click="$router.push('/obrisi-predstavu')">Obrisi predstavu</button>
    </div>

    <AlertDialog
      :isVisible="isDialogVisible"
      :title="dialogTitle"
      :message="dialogMessage"
      :type="dialogType"
      @close="closeDialog"
    />
  </div>
</template>

<script>
// 1. Import the new component
import AlertDialog from '@/components/AlertDialog.vue';

export default {
  name: 'MainScene',
  // 2. Register the component so we can use it in the template
  components: {
    AlertDialog,
  },
  data() {
    return {
      svePredstave: [],
      izabranaPredstava1: null,
      izabranaPredstava2: null,
      // 3. Add data properties to control the dialog
      isDialogVisible: false,
      dialogTitle: '',
      dialogMessage: '',
      dialogType: 'info', // 'info' or 'warning'
    };
  },
  async mounted() {
    this.ucitajPredstave();
  },
  methods: {
    // 4. Add methods to show and hide the dialog
    showDialog(title, message, type = 'info') {
      this.dialogTitle = title;
      this.dialogMessage = message;
      this.dialogType = type;
      this.isDialogVisible = true;
    },
    closeDialog() {
      this.isDialogVisible = false;
    },
    async ucitajPredstave() {
      // ... (this method is unchanged)
      try {
        const response = await fetch('https://carsav-api.onrender.com/api/predstave');
        if (!response.ok) throw new Error('Network response was not ok');
        this.svePredstave = await response.json();
      } catch (error) {
        console.error("Nije moguće učitati predstave:", error);
      }
    },
    // 5. Update the logic methods to use showDialog instead of alert
    async proveriZaDve() {
      if (!this.izabranaPredstava1 || !this.izabranaPredstava2) {
        this.showDialog('Greška', 'Morate izabrati obe predstave.', 'warning');
        return;
      }
      try {
        const url = `https://carsav-api.onrender.com/api/predstave/check-compatibility?p1=${this.izabranaPredstava1}&p2=${this.izabranaPredstava2}`;
        const response = await fetch(url);
        const result = await response.json();

        if (result.compatible) {
          this.showDialog('Info', 'Mogu da se odrze u isto vreme.');
        } else {
          const glumac = result.actor;
          const message = `Ne mogu da se odrze u isto vreme zbog glumca: ${glumac.Ime} ${glumac.Prezime}`;
          this.showDialog('Upozorenje', message, 'warning');
        }
      } catch (error) {
        console.error("Greška pri proveri:", error);
        this.showDialog('Greška', 'Došlo je do greške na serveru.', 'warning');
      }
    },
    async listajSlobodne() {
      if (!this.izabranaPredstava1) {
        this.showDialog('Greška', 'Morate izabrati bar prvu predstavu.', 'warning');
        return;
      }
      try {
        let url = `https://carsav-api.onrender.com/api/predstave/find-available?p1=${this.izabranaPredstava1}`;
        if (this.izabranaPredstava2) {
          url += `&p2=${this.izabranaPredstava2}`;
        }
        const response = await fetch(url);
        const result = await response.json();

        if (result.length === 0) {
          this.showDialog('Info', 'Nema slobodnih predstava koje se mogu održati u isto vreme.');
        } else {
          const predstaveText = result.map(p => p.Naziv).join('\n');
          this.showDialog('Slobodne Predstave', `Predstave koje mogu da se održe su:\n\n${predstaveText}`);
        }
      } catch (error) {
        console.error("Greška pri listanju:", error);
        this.showDialog('Greška', 'Došlo je do greške na serveru.', 'warning');
      }
    }
  }
}
</script>

<style scoped>
.main-scene-container { display: flex; flex-direction: column; align-items: center; gap: 30px; padding: 40px; background-color: white; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); width: 100%; max-width: 800px; }
.action-box { display: flex; justify-content: center; align-items: center; gap: 20px; flex-wrap: wrap; }
.combo-box { background-color: #f2f2f2; border: 1px solid #c8102e; border-radius: 5px; padding: 10px 15px; font-size: 14px; min-width: 200px; }
.styled-button { background-color: #c8102e; color: white; font-size: 16px; font-weight: bold; padding: 15px 25px; border: none; border-radius: 15px; cursor: pointer; transition: background-color 0.3s ease, transform 0.1s ease; text-align: center; }
.styled-button:hover { background-color: #a10d24; }
.styled-button:active { transform: scale(0.98); }
</style>