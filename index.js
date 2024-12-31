import express from 'express';
import fs from "fs";
import bodyParser from "body-parser";

const app = express();
app.use(bodyParser.json());

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data))
    } catch (error) {
        console.log(error);
    }
};

app.get("/", (req, res) => {
    res.send("Welcome to the JOAOS API")
});

app.get("/ventas", (req, res) => {
    const data = readData();
    res.json(data.ventas);
});

app.get("/ventas/:id", (req, res) => { 
    const data = readData();
    const id = parseInt(req.params.id);
    const venta = data.ventas.find((venta) => venta.id === id);
    res.json(venta);
} );

app.post("/ventas", (req, res) => { 
    const data = readData();
    const body = req.body;
    const newVenta = {
        id: data.ventas.lenght +1,
        ...body, 
    };

    data.ventas.push(newVenta);
    writeData(data);
    res.json(newVenta);
});

app.put("/ventas/:id", (req,res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);
    const ventaIndex = data.ventas.findIndex((venta) => venta.id === id);
    data.ventas[ventaIndex] = {
        ...data.ventas[ventaIndex],
        ...body
    };

    writeData(data);
    res.json({message: "Venta actualizada"});

    
});

app.delete("/ventas/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const ventaIndex = data.ventas.findIndex((venta) => venta.id === id);
    data.ventas.splice(ventaIndex,1);
    writeData(data);
    res.json({message:"La venta fue eliminada"} );
});

app.listen(3000, () => {
    console.log('Server listening on port 3000')
});


