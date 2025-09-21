const express = require('express');
const cors = require('cors');
const db = require('./models'); // Import the central db object

const app = express();
app.use(cors());
app.use(express.json()); // IMPORTANT: This middleware is needed to parse JSON request bodies
const PORT = 3000;

app.get('/', (req, res) => res.send('Welcome to the Carsav API!'));

// --- EXISTING ENDPOINTS ---
app.get('/api/predstave', async (req, res) => {
  try {
    const svePredstave = await db.Predstava.findAll({ order: [['Naziv', 'ASC']] });
    res.json(svePredstave);
  } catch (error) {
    console.error("Error fetching plays:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// --- NEW ENDPOINTS ---

// GET all actors
app.get('/api/glumci', async (req, res) => {
  try {
    const sviGlumci = await db.Glumac.findAll({ order: [['Prezime', 'ASC'], ['Ime', 'ASC']] });
    res.json(sviGlumci);
  } catch (error) {
    console.error("Error fetching actors:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new actor
app.post('/api/glumci', async (req, res) => {
  try {
    const { Ime, Prezime } = req.body;
    if (!Ime || !Prezime) {
      return res.status(400).json({ message: "Ime and Prezime are required." });
    }
    const noviGlumac = await db.Glumac.create({ Ime, Prezime });
    res.status(201).json(noviGlumac);
  } catch (error) {
    console.error("Error creating actor:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST a new play with its actors
app.post('/api/predstave', async (req, res) => {
  const { Naziv, glumciIds } = req.body; // Expect a name and an array of actor IDs
  if (!Naziv) {
    return res.status(400).json({ message: "Naziv is required." });
  }

  const t = await db.sequelize.transaction(); // Start a transaction

  try {
    // Create the new play
    const novaPredstava = await db.Predstava.create({ Naziv }, { transaction: t });

    // If there are actors to associate, find them and link them
    if (glumciIds && glumciIds.length > 0) {
      await novaPredstava.setGlumci(glumciIds, { transaction: t });
    }

    await t.commit(); // If everything is successful, commit the transaction
    res.status(201).json(novaPredstava);
  } catch (error) {
    await t.rollback(); // If anything fails, roll back all changes
    console.error("Error creating play:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE a play by its ID
app.delete('/api/predstave/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const predstava = await db.Predstava.findByPk(id);

    if (!predstava) {
      return res.status(404).json({ message: "Predstava not found." });
    }

    await predstava.destroy(); // This will also delete related entries in Uloga due to 'ON DELETE CASCADE'
    res.status(204).send(); // 204 No Content is standard for a successful deletion
  } catch (error) {
    console.error("Error deleting play:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ... after the POST /api/predstave/:id endpoint ...

// Endpoint for "Proveri za dve"
// Checks if two plays have any common actors.
app.get('/api/predstave/check-compatibility', async (req, res) => {
  const { p1, p2 } = req.query; // Get IDs from query params like ?p1=1&p2=2

  if (!p1 || !p2) {
    return res.status(400).json({ message: "Two play IDs (p1, p2) are required." });
  }

  try {
    // Find the first play and include its actors
    const predstava1 = await db.Predstava.findByPk(p1, { include: 'glumci' });
    // Find the second play and include its actors
    const predstava2 = await db.Predstava.findByPk(p2, { include: 'glumci' });

    if (!predstava1 || !predstava2) {
      return res.status(404).json({ message: "One or both plays not found." });
    }

    // Create a Set of actor IDs from the first play for efficient lookup
    const glumci1_Ids = new Set(predstava1.glumci.map(g => g.Id));

    // Find the first actor from the second play who is also in the first play
    const conflictingActor = predstava2.glumci.find(g => glumci1_Ids.has(g.Id));

    if (conflictingActor) {
      // If we found a conflict, return compatible: false and the actor's details
      res.json({ compatible: false, actor: conflictingActor });
    } else {
      // If no conflict was found, they are compatible
      res.json({ compatible: true });
    }
  } catch (error) {
    console.error("Error checking compatibility:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint for "Listaj slobodne"
// Finds all plays that are compatible with the given play(s).
app.get('/api/predstave/find-available', async (req, res) => {
  const { p1, p2 } = req.query;

  if (!p1) {
    return res.status(400).json({ message: "At least one play ID (p1) is required." });
  }

  try {
    // 1. Get all actor IDs from the selected play(s) that we need to avoid
    const conflictingActorIds = new Set();
    const selectedPredstaveIds = [p1];
    if (p2) selectedPredstaveIds.push(p2);

    const selectedPredstave = await db.Predstava.findAll({
      where: { Id: selectedPredstaveIds },
      include: 'glumci'
    });

    for (const predstava of selectedPredstave) {
      for (const glumac of predstava.glumci) {
        conflictingActorIds.add(glumac.Id);
      }
    }

    // 2. Get ALL plays and their actors
    const allPlays = await db.Predstava.findAll({ include: 'glumci' });

    // 3. Filter the list
    const availablePlays = allPlays.filter(play => {
      // Exclude the play(s) we selected
      if (selectedPredstaveIds.includes(String(play.Id))) {
        return false;
      }
      // Check if this play has any conflicting actors
      const hasConflict = play.glumci.some(g => conflictingActorIds.has(g.Id));
      return !hasConflict; // Keep it only if it has NO conflict
    });

    res.json(availablePlays);

  } catch (error) {
    console.error("Error finding available plays:", error);
    res.status(500).json({ message: "Server error" });
  }
});



const startServer = async () => {
  try {
    await db.sequelize.sync();
    console.log('Database connection and synchronization successful.');
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
};

startServer();