var express = require('express');
var router = express.Router();

/* GET users listing. */
import {parseRequest, makeGpsData} from "../utility"
import {mongoUpdate, mongoFind, getMongoDB} from "../mongo";

router.get('/', function (req, res, next) {
    res.send('respond with a resource');
});

router.get('/tenkm', (req, res) => {
    let {lat, lng, maxDistance, minDistance} = parseRequest(req);
    getMongoDB((error, db) => {
        if (error) {
            writeJSONResponse(res, null, error);
        }
        let filter = {
            "location": {
                "$near": {
                    "$geometry": {"type": "Point", "coordinates": [lng, lat]},
                    "$maxDistance": maxDistance || 100000,
                    "$minDistance": minDistance || 0
                }
            }
        };
        return mongoFind('gps_location', filter, {fields: {_id: 1, location: 1, imei: 1, name: 1}}, db).then(result => {
            return makeGpsData(result);
        }).then(data => {
            writeJSONResponse(res, data);
        }).catch(error => {
            writeJSONResponse(res, null, error);
        });

    });
})

router.get('/distance', (req, res) => {

})

const writeJSONResponse = (resp, result, error) => {
    let writeHead = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS"
    };
    let code = 200;
    if (error) {
        result = {
            code: error.code,
            message: error.message,
            stack: error.stack

        }
        code = 500;
    } else {
        result = JSON.stringify({response: result, status: "ok", code});
    }
    resp.writeHead(code, writeHead);
    resp.write(result);
    resp.end();
}
module.exports = router;
