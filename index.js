import express from "express";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";
const app = express();
app.use(express.json());
connectDB();

// Metodos HTTP:
// POST: Es para crear
// GET: Leer
// PATCH: Actualizar parcialmente
// PUT: Actualizar globalmente
// DELETE: Eliminar

app.post("/cards", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    console.log(card);
    // respond with created card
    res.status(201).json(card).send("Card created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating card");
  }
});

app.patch("/cards/:id", async (req, res) => {
  // :id es para meter el ID ahi, es como una concatenación y los dos puntos significan que es una varuable dinnámica
  try {
    const { id } = req.params; // lee el id de la url
    const updates = req.body; // delcaras los datos que se van a utilizar

    const updatedCard = await Card.findByIdAndUpdate(id, updates, {
      new: true,
    }); // se elimina la tarjeta por el id

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" }); // significa que no hubo error en el proceso,simplemente no encontro el ID
    }

    res.status(200).json({
      message: "Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating card" });
  }
});

app.delete("/cards/:id", async (req, res) => {
  // es para meter el ID ahí, los dos puntos significan que es una variable dinamica
  try {
    const { id } = req.params; // se obtiene el ID de la URL
    const deletedcard = await Card.findByIdAndDelete(id); // await es para que espere y el findbyand es para que la busque y la borre

    if (!deletedcard) {
      return res.status(404).json({ message: "Card not found" }); // no hubo error, solo no encontro el ID
    }

    res.status(200).json({
      message: "Card deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleted card" });
  }
});

app.get("/getAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving cards");
}
});

app.get("/getCard/:id", async (req, res) => { // es para buscar una sola carta
  try {
    const {id} = req.params;
    const cards = await Card.findById(cards);
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(400).send("Error");
}
});

//ENDPOINT
//ENDPOINT
app.get("/hola", (req, res) => {
  res.status(200).send("¡Hello world from server! :D");
});

app.get("/hello", (req, res) => {
  res.status(200).send("¡Hello world from server! Express :D");
});

app.post("/send", (req, res) => {
  const { user, email } = req.body;
  //Datos agregados a una DB
  console.log("Datos Recibidos:" + user + "" + email);

  res.status(200).send("Data received succesfully");
});

app.listen(3000, () => {
  console.log("Server started at http://localhost:3000");
});
