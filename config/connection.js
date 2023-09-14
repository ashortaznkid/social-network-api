const { connect, connection } = require('mongoose');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/Cluster1');


module.exports = connection;