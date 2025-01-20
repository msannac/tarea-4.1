const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const helmet = require("helmet");

const uri =
  "mongodb+srv://manueldesande:GmtZD1KtRHPZmhDd@cluster0.b5ijp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    console.log("Conectado a MongoDB");
  } catch (err) {
    console.error("Error al conectar a la base de datos:", err);
  }
}
run().catch(console.dir);

const app = express();
app.use(express.json());
app.use(helmet());

const port = process.env.PORT || 8080;

// Lista todos los concesionarios
app.get("/concesionarios", async (req, res) => {
  try {
    const concesionarios = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .find()
      .toArray();
    res.json(concesionarios);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener concesionarios", error: err });
  }
});

// Crea un nuevo concesionario
app.post("/concesionarios", async (req, res) => {
  const nuevoConcesionario = {
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    coches: [],
  };
  const result = await client
    .db("miBaseDeDatos")
    .collection("concesionarios")
    .insertOne(nuevoConcesionario);
  res.json(result);
});

// Obtener un concesionario por ID
app.get("/concesionarios/:id", async (req, res) => {
  try {
    const concesionario = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!concesionario) {
      return res.status(404).json({ message: "Concesionario no encontrado" });
    }
    res.json(concesionario);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener concesionario", error: err });
  }
});

// Actualizar un concesionario por ID
app.put("/concesionarios/:id", async (req, res) => {
  try {
    const result = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: { nombre: req.body.nombre, direccion: req.body.direccion } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Concesionario no encontrado" });
    }
    res.json({ message: "Concesionario actualizado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al actualizar concesionario", error: err });
  }
});

// Borrar un concesionario por ID
app.delete("/concesionarios/:id", async (req, res) => {
  try {
    const result = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Concesionario no encontrado" });
    }
    res.json({ message: "Concesionario borrado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al borrar concesionario", error: err });
  }
});

// Devuelve todos los coches de un concesionario por ID
app.get("/concesionarios/:id/coches", async (req, res) => {
  try {
    const concesionario = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!concesionario) {
      return res.status(404).json({ message: "Concesionario no encontrado" });
    }
    res.json(concesionario.coches);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener coches", error: err });
  }
});

// Añadir un nuevo coche a un concesionario por ID
app.post("/concesionarios/:id/coches", async (req, res) => {
  try {
    const nuevoCoche = {
      id: new ObjectId(),
      modelo: req.body.modelo,
      cv: req.body.cv,
      precio: req.body.precio,
    };
    const result = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $push: { coches: nuevoCoche } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Concesionario no encontrado" });
    }
    res.json(nuevoCoche);
  } catch (err) {
    res.status(500).json({ message: "Error al añadir coche", error: err });
  }
});

// Obtener un coche por ID de un concesionario por ID
app.get("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const concesionario = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!concesionario) {
      return res.status(404).json({ message: "Concesionario no encontrado" });
    }
    const coche = concesionario.coches.find(
      (c) => c.id.toString() === req.params.cocheId
    );
    if (!coche) {
      return res.status(404).json({ message: "Coche no encontrado" });
    }
    res.json(coche);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener coche", error: err });
  }
});

// Actualizar un coche por ID de un concesionario por ID
app.put("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const result = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .updateOne(
        {
          _id: new ObjectId(req.params.id),
          "coches.id": new ObjectId(req.params.cocheId),
        },
        {
          $set: {
            "coches.$.modelo": req.body.modelo,
            "coches.$.cv": req.body.cv,
            "coches.$.precio": req.body.precio,
          },
        }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Coche no encontrado" });
    }
    res.json({ message: "Coche actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar coche", error: err });
  }
});

// Borrar un coche por ID de un concesionario por ID
app.delete("/concesionarios/:id/coches/:cocheId", async (req, res) => {
  try {
    const result = await client
      .db("miBaseDeDatos")
      .collection("concesionarios")
      .updateOne(
        { _id: new ObjectId(req.params.id) },
        { $pull: { coches: { id: new ObjectId(req.params.cocheId) } } }
      );
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Coche no encontrado" });
    }
    res.json({ message: "Coche borrado" });
  } catch (err) {
    res.status(500).json({ message: "Error al borrar coche", error: err });
  }
});

app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
