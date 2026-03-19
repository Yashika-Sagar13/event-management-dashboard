const mongoose = require('mongoose');
const dns = require('dns');

// Some environments (Windows DNS cache/proxy) refuse SRV DNS lookups used by mongodb+srv URIs.
// Force Node to use public DNS servers so Atlas SRV resolution works consistently.
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
