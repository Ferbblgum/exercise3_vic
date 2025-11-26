import express from "express";
import cors from "cors";
import { connectDB } from "./db.js";
import { Card } from "./models/Card.js";
import dotenv from "dotenv";
dotenv.config();
const app = express()
app.use(express.json());
app.use(cors());  
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

app.put("/UpdateCard/:id", async (req, res) => {
  try {
    const { id } = req.params; // obtenemos el ID de la URL
    const updates = req.body; //  los campos que quieres actualizar

    // Usamos findByIdAndUpdate para actualizar parcialmente
    const updatedCard = await Card.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating card" });
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

// ENDPOINT que enseña todo
app.get("/api/info", async (req, res) => {
  try {
    // Obtener todas las cards para mostrar datos de ejemplo
    const cards = await Card.find().limit(5);
    
    // Información completa sobre todos los endpoints disponibles
    const apiInfo = {
      message: "API Information - All Endpoints Summary",
      timestamp: new Date().toISOString(),
      baseURL: "http://localhost:3000",
      version: "1.0",
      
      endpoints: {
        // CREATE ENDPOINTS
        create: {
          "POST /cards": {
            description: "Create a new card",
            requestBody: "Object with card data",
            successResponse: {
              status: 201,
              body: "Created card object",
              message: "Card created successfully"
            },
            errorResponse: {
              status: 500,
              message: "Error creating card"
            },
            notes: "Uses Card.create() method"
          }
        },
        
        // READ ENDPOINTS
        read: {
          "GET /getAllCards": {
            description: "Get all cards from database",
            successResponse: {
              status: 200,
              body: "Array of all card objects"
            },
            errorResponse: {
              status: 500,
              message: "Error retrieving cards"
            },
            notes: "Uses Card.find() without filters"
          },
          "GET /getCard/:id": {
            description: "Get a specific card by ID",
            parameters: {
              id: "Card ID (MongoDB ObjectId) - dynamic parameter"
            },
            successResponse: {
              status: 200,
              body: "Single card object"
            },
            errorResponse: {
              status: 400,
              message: "Error"
            },
            notes: "Note: There's a bug in the implementation - uses 'cards' instead of 'id' variable"
          }
        },
        
        // UPDATE ENDPOINTS
        update: {
          "PUT /UpdateCard/:id": {
            description: "Update entire card (replace all fields)",
            parameters: {
              id: "Card ID (MongoDB ObjectId) - dynamic parameter"
            },
            requestBody: "Complete card object with all fields",
            successResponse: {
              status: 200,
              body: {
                message: "Card updated successfully",
                data: "Updated card object"
              }
            },
            errorResponses: [
              {
                status: 404,
                message: "Card not found"
              },
              {
                status: 500,
                message: "Error updating card"
              }
            ],
            notes: "Uses findByIdAndUpdate with {new: true} to return updated document"
          },
          "PATCH /cards/:id": {
            description: "Partially update card (specific fields only)",
            parameters: {
              id: "Card ID (MongoDB ObjectId) - dynamic parameter"
            },
            requestBody: "Partial card object with only fields to update",
            successResponse: {
              status: 200,
              body: {
                message: "Card updated successfully",
                data: "Updated card object"
              }
            },
            errorResponses: [
              {
                status: 404,
                message: "Card not found"
              },
              {
                status: 500,
                message: "Error updating card"
              }
            ],
            notes: "Also uses findByIdAndUpdate - similar to PUT but semantically different"
          }
        },
        
        // DELETE ENDPOINTS
        delete: {
          "DELETE /cards/:id": {
            description: "Delete a card by ID",
            parameters: {
              id: "Card ID (MongoDB ObjectId) - dynamic parameter"
            },
            successResponse: {
              status: 200,
              body: {
                message: "Card deleted successfully"
              }
            },
            errorResponses: [
              {
                status: 404,
                message: "Card not found"
              },
              {
                status: 500,
                message: "Error deleted card"
              }
            ],
            notes: "Uses findByIdAndDelete method"
          }
        },
        
        // UTILITY ENDPOINTS
        utility: {
          "GET /hola": {
            description: "Spanish greeting endpoint",
            successResponse: {
              status: 200,
              body: "¡Hello world from server! :D"
            },
            notes: "Simple text response"
          },
          "GET /hello": {
            description: "English greeting endpoint",
            successResponse: {
              status: 200,
              body: "¡Hello world from server! Express :D"
            },
            notes: "Simple text response with Express mention"
          },
          "POST /send": {
            description: "Receive and process user data",
            requestBody: {
              user: "Username (string)",
              email: "User email (string)"
            },
            successResponse: {
              status: 200,
              body: "Data received succesfully"
            },
            notes: "Logs data to console but doesn't save to database"
          }
        }
      },
      
      // Sample data from database
      sampleData: {
        totalCardsInDB: await Card.countDocuments(),
        displayedCards: cards.length,
        cards: cards
      },
      
      // API Statistics
      statistics: {
        totalEndpoints: 8,
        byMethod: {
          GET: 4,
          POST: 2,
          PUT: 1,
          PATCH: 1,
          DELETE: 1
        },
        byCategory: {
          CRUD_Operations: 5,
          Utility_Endpoints: 3
        }
      },
      
      // Important Notes
      notes: {
        bugs: [
          "GET /getCard/:id has implementation bug - uses 'cards' instead of 'id' variable"
        ],
        inconsistencies: [
          "Mixed endpoint naming: some use plural '/cards', others use specific names",
          "Different error status codes: some use 400, others 500",
          "Inconsistent response formats across similar endpoints"
        ],
        improvements: [
          "Consider consistent naming convention for all endpoints",
          "Standardize error response formats",
          "Add input validation for all endpoints"
        ]
      },
      
      // Usage Examples
      usageExamples: {
        createCard: {
          method: "POST",
          url: "http://localhost:3000/cards",
          body: {
            "title": "Example Card",
            "description": "This is an example card",
            "type": "example"
          }
        },
        getCard: {
          method: "GET",
          url: "http://localhost:3000/getCard/507f1f77bcf86cd799439011"
        },
        updateCard: {
          method: "PUT",
          url: "http://localhost:3000/UpdateCard/507f1f77bcf86cd799439011",
          body: {
            "title": "Updated Card Title",
            "description": "Updated description"
          }
        }
      }
    };
    
    res.status(200).json(apiInfo);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving API information",
      error: error.message,
      timestamp: new Date().toISOString()
});
}
});