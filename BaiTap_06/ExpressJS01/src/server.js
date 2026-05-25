require('dotenv').config();
const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const configViewEngine = require('./config/viewEngine');
const connection = require('./config/database');
const { seedProductsIfEmptyService } = require('./services/productService');

const app = express();
const port = process.env.PORT || 8888;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

app.use('/v1/api/', apiRoutes);

(async () => {
    try {
        await connection();
        const seedResult = await seedProductsIfEmptyService();
        if (seedResult.seeded) {
            console.log(`Seeded ${seedResult.totalProducts} products for storefront demo.`);
        }
        app.listen(port, () => {
            console.log(`Backend Nodejs App listening on port ${port}`);
        })
    } catch (error) {
        console.log(">>> Error connect to DB: ", error);
    }
})();