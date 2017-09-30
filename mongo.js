var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/track_location';

const getMongoDB = (callback) => {

    MongoClient.connect(url, function (err, db) {
        if (err) {
            callback(err);
            return;
        }
        callback(null, db);

    });
};

var mongoFind = (table, filter, options, db) => {
    return new Promise((resolve, reject) => {
        db.collection(table).find(filter, options).toArray((err, result) => {
            if (err) {
                reject(err);
                return;
            }
            //console.log("result in find>>>>>>>" + JSON.stringify(result));
            resolve(result);
        })
    })
};

var mongoUpdate = (table, query, update, db, options) => {
    options = options || {};
    options.w = 1;
    var startTime = new Date();
    return new Promise((resolve, reject) => {
        db.collection(table).update(query, update, options, function (err, result) {
            if (err) {
                reject(err);
                return;
            }
            resolve(result.result || result);
        })
    })
};

module.exports = {
    mongoFind,
    mongoUpdate,
    getMongoDB
};