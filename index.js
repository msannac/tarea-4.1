const express = require("express");

const { MongoClient, ServerApiVersion } = require("mongodb");

const uri =
  "mongodb+srv://manueldesande:GmtZD1KtRHPZmhDd@cluster0.b5ijp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server (optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Error al conectar a la base de datos:", err);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

const app = express();
app.use(express.json()); // Permite recibir JSON en las solicitudes

const port = process.env.PORT || 8080;

// Estructura de datos (inicialmente en memoria)
let concesionarios = [
  {
    id: 1,
    nombre: "Concesionario A",
    direccion: "Calle Falsa 123",
    coches: [
      { id: 1, modelo: "Renault Clio", cv: 75, precio: 8000 },
      { id: 2, modelo: "Nissan Skyline R34", cv: 280, precio: 30000 },
    ],
  },
  {
    id: 2,
    nombre: "Concesionario B",
    direccion: "Avenida Siempre Viva 456",
    coches: [
      { id: 1, modelo: "Ford Fiesta", cv: 90, precio: 10000 },
      { id: 2, modelo: "Toyota Corolla", cv: 130, precio: 12000 },
    ],
  },
];

// Lista todos los concesionarios
app.get("/concesionarios", (req, res) => {
  res.json(concesionarios);
});

// Crea un nuevo concesionario
app.post("/concesionarios", (req, res) => {
  const nuevoConcesionario = {
    id: concesionarios.length + 1,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    coches: [],
  };
  concesionarios.push(nuevoConcesionario);
  res.json({
    message: "Concesionario creado",
    concesionario: nuevoConcesionario,
  });
});

// Obtiene un concesionario por id
app.get("/concesionarios/:id", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  res.json(concesionario);
});

// Actualiza un concesionario por id
app.put("/concesionarios/:id", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });

  concesionario.nombre = req.body.nombre || concesionario.nombre;
  concesionario.direccion = req.body.direccion || concesionario.direccion;

  res.json({ message: "Concesionario actualizado", concesionario });
});

// Borra un concesionario por id
app.delete("/concesionarios/:id", (req, res) => {
  const index = concesionarios.findIndex(
    (c) => c.id === parseInt(req.params.id)
  );
  if (index === -1)
    return res.status(404).json({ message: "Concesionario no encontrado" });

  concesionarios.splice(index, 1);
  res.json({ message: "Concesionario eliminado" });
});

// Obtiene todos los coches de un concesionario
app.get("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });
  res.json(concesionario.coches);
});

// Añade un nuevo coche a un concesionario
app.post("/concesionarios/:id/coches", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });

  const nuevoCoche = {
    id: concesionario.coches.length + 1,
    modelo: req.body.modelo,
    cv: req.body.cv,
    precio: req.body.precio,
  };
  concesionario.coches.push(nuevoCoche);
  res.json({ message: "Coche añadido", coche: nuevoCoche });
});

// Obtiene un coche específico de un concesionario
app.get("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });

  const coche = concesionario.coches.find(
    (c) => c.id === parseInt(req.params.cocheId)
  );
  if (!coche) return res.status(404).json({ message: "Coche no encontrado" });

  res.json(coche);
});

// Actualiza un coche de un concesionario
app.put("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });

  const coche = concesionario.coches.find(
    (c) => c.id === parseInt(req.params.cocheId)
  );
  if (!coche) return res.status(404).json({ message: "Coche no encontrado" });

  coche.modelo = req.body.modelo || coche.modelo;
  coche.cv = req.body.cv || coche.cv;
  coche.precio = req.body.precio || coche.precio;

  res.json({ message: "Coche actualizado", coche });
});

// Borra un coche de un concesionario
app.delete("/concesionarios/:id/coches/:cocheId", (req, res) => {
  const concesionario = concesionarios.find(
    (c) => c.id === parseInt(req.params.id)
  );
  if (!concesionario)
    return res.status(404).json({ message: "Concesionario no encontrado" });

  const index = concesionario.coches.findIndex(
    (c) => c.id === parseInt(req.params.cocheId)
  );
  if (index === -1)
    return res.status(404).json({ message: "Coche no encontrado" });

  concesionario.coches.splice(index, 1);
  res.json({ message: "Coche eliminado" });
});

// Iniciamos el servidor
app.listen(port, () => {
  console.log(`Servidor desplegado en puerto: ${port}`);
});
