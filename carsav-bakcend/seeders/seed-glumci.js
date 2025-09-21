// Import the database connection and the Glumac model
const sequelize = require('../database/config');
const Glumac = require('../models/Glumac');

// The list of actors to be inserted
const glumciData = [
  { Ime: 'Anja', Prezime: 'Josifovski' },
  { Ime: 'Branka', Prezime: 'Katić' },
  { Ime: 'Dunja', Prezime: 'Stojanović' },
  { Ime: 'Isidora', Prezime: 'Simijonović' },
  { Ime: 'Iva', Prezime: 'Ilinčić' },
  { Ime: 'Ivana', Prezime: 'Nikolić' },
  { Ime: 'Jana', Prezime: 'Milosavljević' },
  { Ime: 'Jelisaveta', Prezime: 'Teodosić' },
  { Ime: 'Ljubinka', Prezime: 'Klarić' },
  { Ime: 'Milena', Prezime: 'Pavlović' },
  { Ime: 'Milica', Prezime: 'Milša' },
  { Ime: 'Milica', Prezime: 'Zarić' },
  { Ime: 'Mirjana', Prezime: 'Karanović' },
  { Ime: 'Nada', Prezime: 'Macanković' },
  { Ime: 'Nataša', Prezime: 'Marković' },
  { Ime: 'Paulina', Prezime: 'Manov' },
  { Ime: 'Sandra', Prezime: 'Bugarski' },
  { Ime: 'Slađana', Prezime: 'Vlajović' },
  { Ime: 'Vanja', Prezime: 'Nenadić' },
  { Ime: 'Aleksandar', Prezime: 'Alač' },
  { Ime: 'Aleksandar', Prezime: 'Jovanović' },
  { Ime: 'Aleksandar', Prezime: 'Radojičić' },
  { Ime: 'Andrej', Prezime: 'Šepetkovski' },
  { Ime: 'Andrija', Prezime: 'Kuzmanović' },
  { Ime: 'Daniel', Prezime: 'Sič' },
  { Ime: 'Dragiša', Prezime: 'Milojković' },
  { Ime: 'Filip', Prezime: 'Gajić' },
  { Ime: 'Ivan', Prezime: 'Tomić' },
  { Ime: 'Ivan', Prezime: 'Zablaćanski' },
  { Ime: 'Jovo', Prezime: 'Maksić' },
  { Ime: 'Ljubomir', Prezime: 'Bulajić' },
  { Ime: 'Marko', Prezime: 'Gvero' },
  { Ime: 'Milan', Prezime: 'Kolak' },
  { Ime: 'Milan', Prezime: 'Zarić' },
  { Ime: 'Milan', Prezime: 'Čučilović' },
  { Ime: 'Milorad', Prezime: 'Damjanović' },
  { Ime: 'Miloš', Prezime: 'Biković' },
  { Ime: 'Miodrag', Prezime: 'Radonjić' },
  { Ime: 'Nenad', Prezime: 'Gvozdenović' },
  { Ime: 'Pavle', Prezime: 'Pekić' },
  { Ime: 'Stefan', Prezime: 'Radonjić' },
  { Ime: 'Vladan', Prezime: 'Milić' }
];

// An async function to run the seeding process
const seedDatabase = async () => {
  try {
    // This connects to the DB and ensures tables exist.
    await sequelize.sync();

    // Use bulkCreate to insert all actors.
    // { ignoreDuplicates: true } will prevent errors if you accidentally run the script twice.
    await Glumac.bulkCreate(glumciData, { ignoreDuplicates: true });

    console.log('✅ Glumci su uspešno ubačeni u bazu.');

  } catch (error) {
    console.error('❌ Greška prilikom ubacivanja glumaca:', error);
  } finally {
    // Close the database connection, so the script terminates.
    await sequelize.close();
  }
};

// Run the function
seedDatabase();