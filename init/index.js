const mongoose = require('mongoose');
const intiData = require('./data.js');
const Listing = require('../models/listing.js');

const MONGO_URL = process.env.ATLASDB_URL;

main()
.then(() => {
    console.log('Connected to DB!');
})
.catch(err => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await Listing.deleteMany({});
    intiData.data = intiData.data.map(obj => ({...obj, owner: '66712cebfc1354edd2a9c4d7'}));
    await Listing.insertMany(intiData.data);
    console.log("Data initialized!");
}

initDB();