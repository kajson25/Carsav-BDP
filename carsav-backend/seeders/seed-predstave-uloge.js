// This one line now correctly imports the connection AND all fully-associated models
const db = require('../models');

const data = [
  { nazivPredstave: 'Anđela', glumci: [ 'MILUTIN MIMA KARADŽIĆ', 'GORAN ŠUŠLJIK', 'STAŠA NIKOLIĆ' ] },
  { nazivPredstave: 'Sumrak bogova', glumci: [ 'ALEKSANDAR ALAČ', 'BRANKA KATIĆ', 'ISIDORA SIMIJONOVIĆ', 'VLADAN MILIĆ', 'PAVLE PEKIĆ', 'JOVO MAKSIĆ', 'MILAN ČUČILOVIĆ', 'MILICA ZARIĆ' ] },
  { nazivPredstave: 'Divlje meso', glumci: [ 'JOVO MAKSIĆ', 'SANDRA BUGARSKI', 'VUKAŠIN JOVANOVIĆ', 'MARKO TODOROVIĆ', 'ALEKSANDAR VUČKOVIĆ', 'ANDRIJANA ĐORĐEVIĆ', 'IVANA DUDIĆ', 'VANJA NENADIĆ', 'MINA NENADOVIĆ', 'PAVLE PEKIĆ', 'STEFAN RADONJIĆ', 'MILAN ČUČILOVIĆ', 'JANA MILOSAVLJEVIĆ', 'ALEKSANDAR JOVANOVIĆ' ] },
  { nazivPredstave: 'Kramer protiv Kramera', glumci: [ 'ANDRIJA KUZMANOVIĆ', 'NADA MACANKOVIĆ', 'MARIJA PIKIĆ' ] }
];

function parseFullName(fullName) {
  const names = fullName.split('/').map(name => name.trim());
  return names.map(name => {
    const parts = name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1).toLowerCase());
    const prezime = parts.pop();
    const ime = parts.join(' ');
    return { Ime: ime, Prezime: prezime };
  });
}

const seedDatabase = async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log('Database reset and models synchronized.');

    const initialGlumciData = [
        { Ime: 'Anja', Prezime: 'Josifovski' }, { Ime: 'Branka', Prezime: 'Katić' }, { Ime: 'Dunja', Prezime: 'Stojanović' }, { Ime: 'Isidora', Prezime: 'Simijonović' }, { Ime: 'Iva', Prezime: 'Ilinčić' }, { Ime: 'Ivana', Prezime: 'Nikolić' }, { Ime: 'Jana', Prezime: 'Milosavljević' }, { Ime: 'Jelisaveta', Prezime: 'Teodosić' }, { Ime: 'Ljubinka', Prezime: 'Klarić' }, { Ime: 'Milena', Prezime: 'Pavlović' }, { Ime: 'Milica', Prezime: 'Milša' }, { Ime: 'Milica', Prezime: 'Zarić' }, { Ime: 'Mirjana', Prezime: 'Karanović' }, { Ime: 'Nada', Prezime: 'Macanković' }, { Ime: 'Nataša', Prezime: 'Marković' }, { Ime: 'Paulina', Prezime: 'Manov' }, { Ime: 'Sandra', Prezime: 'Bugarski' }, { Ime: 'Slađana', Prezime: 'Vlajović' }, { Ime: 'Vanja', Prezime: 'Nenadić' }, { Ime: 'Aleksandar', Prezime: 'Alač' }, { Ime: 'Aleksandar', Prezime: 'Jovanović' }, { Ime: 'Aleksandar', Prezime: 'Radojičić' }, { Ime: 'Andrej', Prezime: 'Šepetkovski' }, { Ime: 'Andrija', Prezime: 'Kuzmanović' }, { Ime: 'Daniel', Prezime: 'Sič' }, { Ime: 'Dragiša', Prezime: 'Milojković' }, { Ime: 'Filip', Prezime: 'Gajić' }, { Ime: 'Ivan', Prezime: 'Tomić' }, { Ime: 'Ivan', Prezime: 'Zablaćanski' }, { Ime: 'Jovo', Prezime: 'Maksić' }, { Ime: 'Ljubomir', Prezime: 'Bulajić' }, { Ime: 'Marko', Prezime: 'Gvero' }, { Ime: 'Milan', Prezime: 'Kolak' }, { Ime: 'Milan', Prezime: 'Zarić' }, { Ime: 'Milan', Prezime: 'Čučilović' }, { Ime: 'Milorad', Prezime: 'Damjanović' }, { Ime: 'Miloš', Prezime: 'Biković' }, { Ime: 'Miodrag', Prezime: 'Radonjić' }, { Ime: 'Nenad', Prezime: 'Gvozdenović' }, { Ime: 'Pavle', Prezime: 'Pekić' }, { Ime: 'Stefan', Prezime: 'Radonjić' }, { Ime: 'Vladan', Prezime: 'Milić' }
    ];
    await db.Glumac.bulkCreate(initialGlumciData);
    console.log('Initial actors seeded.');

    for (const predstavaData of data) {
      const [predstava] = await db.Predstava.findOrCreate({ where: { Naziv: predstavaData.nazivPredstave } });
      const glumciInstances = [];
      for (const fullName of predstavaData.glumci) {
        const parsedNames = parseFullName(fullName);
        for (const name of parsedNames) {
          const [glumac] = await db.Glumac.findOrCreate({ where: { Ime: name.Ime, Prezime: name.Prezime } });
          glumciInstances.push(glumac);
        }
      }
      await predstava.setGlumci(glumciInstances); // This will now work
      console.log(`Associated actors for play "${predstava.Naziv}".`);
    }

    console.log('--- Seeding complete! ---');
  } catch (error) {
    console.error('--- Seeding failed: ---', error);
  } finally {
    await db.sequelize.close();
  }
};

seedDatabase();