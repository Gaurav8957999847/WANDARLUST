const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    let user = await User.findOne({ username: "demouser" });
    if (!user) {
        const newUser = new User({ email: "demouser@gmail.com", username: "demouser" });
        user = await User.register(newUser, "helloworld");
        console.log("Created new user: demouser");
    }

    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: user._id, geometry: { type: 'Point', coordinates: [77.209, 28.6139] } }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();
