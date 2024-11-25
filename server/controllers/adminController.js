const db = require('../db/connection'); // Ensure you have a MySQL connection setup
const path = require('path');

// Utility function to execute queries
const executeQuery = async (query, params = []) => {
    return new Promise((resolve, reject) => {
        db.query(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

exports.addSpot = async (req, res) => {
    try {
        const { totalSpot } = req.body;
        console.log(totalSpot);

        // Ensure that totalSpot is provided
        if (totalSpot === undefined || totalSpot === null) {
            return res.status(400).json({ error: 'totalSpot is required and cannot be null' });
        }

        // Create the addspot table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS addspot (
                id INT AUTO_INCREMENT PRIMARY KEY,
                totalSpot INT NOT NULL
            );
        `;
        await executeQuery(createTableQuery);

        // Check if a record already exists in the table
        const checkRecordQuery = `
            SELECT id FROM addspot LIMIT 1;
        `;
        const existingRecord = await executeQuery(checkRecordQuery);

        let result;

        if (existingRecord.length > 0) {
            // If a record exists, update the totalSpot value
            const updateSpotQuery = `
                UPDATE addspot
                SET totalSpot = ?
                WHERE id = ?;
            `;
            result = await executeQuery(updateSpotQuery, [totalSpot, existingRecord[0].id]);

            res.status(200).json({
                message: 'Spot updated successfully',
                data: {
                    id: existingRecord[0].id,
                    totalSpot: totalSpot,
                },
            });
        } else {
            // If no record exists, insert a new one
            const addSpotQuery = `
                INSERT INTO addspot (totalSpot)
                VALUES (?);
            `;
            result = await executeQuery(addSpotQuery, [totalSpot]);

            res.status(201).json({
                message: 'Spot added successfully',
                data: {
                    id: result.insertId,
                    totalSpot: totalSpot,
                },
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding or updating spot' });
    }
};






exports.addToken = async (req, res) => {
    try {
        const file = req.file;

        // Check if a file is provided
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const tokenName = req.body.token_name;
        const id = req.body.id;
        const tokenIconPath = file.path; // Path where the file is saved

        // Validate required fields
        if (!tokenName) {
            return res.status(400).json({ error: 'Token name is required' });
        }

        // Create the addtoken table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS addtoken (
                id INT AUTO_INCREMENT PRIMARY KEY,
                token_name VARCHAR(255) NOT NULL,
                token_icon VARCHAR(255) 
            );
        `;
        await executeQuery(createTableQuery);

        // Check if the token already exists by id
        const checkTokenQuery = `
            SELECT * FROM addtoken WHERE id = ?;
        `;
        const existingToken = await executeQuery(checkTokenQuery, [id]);

        if (existingToken.length > 0) {
            // If the token exists, update the record
            const updateTokenQuery = `
                UPDATE addtoken 
                SET token_name = ?, token_icon = ?
                WHERE id = ?;
            `;
            await executeQuery(updateTokenQuery, [tokenName, tokenIconPath, id]);

            // Respond with success for update
            res.status(200).json({
                message: 'Token updated successfully',
                data: {
                    id: id,
                    token_name: tokenName,
                    token_icon: tokenIconPath
                }
            });
        } else {
            // If the token does not exist, insert a new record
            const addTokenQuery = `
                INSERT INTO addtoken (token_name, token_icon)
                VALUES (?, ?);
            `;
            const result = await executeQuery(addTokenQuery, [tokenName, tokenIconPath]);

            // Respond with success for insert
            res.status(201).json({
                message: 'Token added successfully',
                data: {
                    id: result.insertId, // `insertId` is provided by MySQL
                    token_name: tokenName,
                    token_icon: tokenIconPath
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding or updating token' });
    }
};



exports.addPrice = async (req, res) => {
    try {
        const file = req.file;

        // Initialize walletQrCode variable
        let walletQrCode = null;

        // If a file is provided, assign the file path to walletQrCode
        if (file) {
            walletQrCode = file.path; // Path where the file is saved
        }

        const { price_per_grid, wallet_name, wallet_address, id } = req.body;

        // Validate that ID is provided (as it's mandatory for finding the record)
        if (!id) {
            return res.status(400).json({ error: 'Missing ID' });
        }

        // Create the addprice table if it doesn't exist
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS addprice (
                id INT AUTO_INCREMENT PRIMARY KEY,
                price_per_grid INT,
                wallet_name VARCHAR(255),
                wallet_address VARCHAR(255),
                walletQrCode VARCHAR(255)
            );
        `;
        await executeQuery(createTableQuery);

        // Check if the price record already exists by id
        const checkPriceQuery = `
            SELECT * FROM addprice WHERE id = ?;
        `;
        const existingPrice = await executeQuery(checkPriceQuery, [id]);

        if (existingPrice.length > 0) {
            const currentPrice = existingPrice[0];

            // Prepare updated values, only if they exist in the request body
            const updatedFields = [];
            const updateValues = [];

            if (price_per_grid && currentPrice.price_per_grid !== price_per_grid) {
                updatedFields.push('price_per_grid = ?');
                updateValues.push(price_per_grid);
            }

            if (wallet_name && currentPrice.wallet_name !== wallet_name) {
                updatedFields.push('wallet_name = ?');
                updateValues.push(wallet_name);
            }

            if (wallet_address && currentPrice.wallet_address !== wallet_address) {
                updatedFields.push('wallet_address = ?');
                updateValues.push(wallet_address);
            }

            // Only add walletQrCode if it's defined (i.e., file was uploaded)
            if (walletQrCode && currentPrice.walletQrCode !== walletQrCode) {
                updatedFields.push('walletQrCode = ?');
                updateValues.push(walletQrCode);
            }

            // If any fields are updated, perform the update query
            if (updatedFields.length > 0) {
                const updatePriceQuery = `
                    UPDATE addprice 
                    SET ${updatedFields.join(', ')}
                    WHERE id = ?;
                `;
                updateValues.push(id); // Add the ID as the last parameter for WHERE clause
                await executeQuery(updatePriceQuery, updateValues);

                // Respond with success for update
                res.status(200).json({
                    message: 'Price updated successfully',
                    data: {
                        id: id,
                        price_per_grid: price_per_grid || currentPrice.price_per_grid,
                        wallet_name: wallet_name || currentPrice.wallet_name,
                        wallet_address: wallet_address || currentPrice.wallet_address,
                        walletQrCode: walletQrCode || currentPrice.walletQrCode
                    }
                });
            } else {
                // If no fields have changed, respond without updating
                res.status(200).json({
                    message: 'No changes detected. Price not updated.',
                    data: {
                        id: id,
                        price_per_grid: currentPrice.price_per_grid,
                        wallet_name: currentPrice.wallet_name,
                        wallet_address: currentPrice.wallet_address,
                        walletQrCode: currentPrice.walletQrCode
                    }
                });
            }
        } else {
            // If the record does not exist, insert a new record
            const addPriceQuery = `
                INSERT INTO addprice (price_per_grid, wallet_name, wallet_address, walletQrCode)
                VALUES (?, ?, ?, ?);
            `;
            const result = await executeQuery(addPriceQuery, [
                price_per_grid,
                wallet_name,
                wallet_address,
                walletQrCode
            ]);

            // Respond with success for insert
            res.status(201).json({
                message: 'Price added successfully',
                data: {
                    id: result.insertId, // `insertId` is provided by MySQL
                    price_per_grid,
                    wallet_name,
                    wallet_address,
                    walletQrCode
                }
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error adding or updating price' });
    }
};



exports.getSpotToken = async (req, res) => {
    try {
        // Query to retrieve all spot token data
        const getSpotQuery = `
            SELECT * FROM addspot;
        `;
        const spotData = await executeQuery(getSpotQuery);

        // If no data is found, return a 404 response
        if (spotData.length === 0) {
            return res.status(404).json({ error: 'No spot tokens found' });
        }

        // Return the spot token data
        res.status(200).json({
            message: 'Spot tokens fetched successfully',
            data: spotData // Return all records found
        });
    } catch (err) {
        console.error('Error fetching spot token data:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
};


exports.getAddToken = async (req, res) => {
    try {
        // Query to retrieve all add token data
        const getAddQuery = `
            SELECT * FROM addtoken;
        `;
        const addData = await executeQuery(getAddQuery);

        // If no data is found, return a 404 response
        if (addData.length === 0) {
            return res.status(404).json({ error: 'No add tokens found' });
        }

        // Return the add token data
        res.status(200).json({
            message: 'Add tokens fetched successfully',
            data: addData // Return all records found
        });
    } catch (err) {
        console.error('Error fetching add token data:', err.message);
        res.status(500).json({ error: 'Internal server error', details: err.message });
    }
}


exports.getPrice = async (req,res)=>{
    try{
        // Query to retrieve all price data
        const getPriceQuery = `
            SELECT * FROM addprice;
        `;
        const priceData = await executeQuery(getPriceQuery);

        // If no data is found, return a 404 response
        if(priceData.length === 0){
            return res.status(404).json({error: 'No prices found'});
        }

        // Return the price data
        res.status(200).json({
            message: 'Prices fetched successfully',
            data: priceData // Return all records found
        });
    } catch(err){
        console.error('Error fetching price data:', err.message);
        res.status(500).json({error: 'Internal server error', details: err.message});
    }
}