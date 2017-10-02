var express = require('express');
var router = express.Router();

/* GET users listing. */
import {parseRequest, makeGpsData, getDistanceFromLatLonInKm, readGPSLocation,getTotalTimeTakenAndCalories,deepEqual} from "../utility"
import {mongoUpdate, mongoFind, getMongoDB,} from "../mongo";
import {emitUpdates} from "../socket";

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

router.all('/distance', (req, res) => {
    let {source, destination} = parseRequest(req);
    if (!source || !destination) {
        writeJSONResponse(res, null, Error("speed/source/destination all field are mandatory"));
        return;
    }
    let result = getLocation(source, destination);
    writeJSONResponse(res, result);
});

router.all('/chooseimei', (req, res) => {
    let {source, destination, speed, imei,age,sex,weight,heartRate} = parseRequest(req);
    var time = void 0;
    var gps =0;
    let gps_location = readGPSLocation();
    time = setInterval(_ => {
        let gpsSource = gps_location[gps++];
        delete gpsSource.place;
        if(!gpsSource){
            clearInterval(time);
            return;
        }
        let oldTime=getLocation(source, gpsSource, speed);
        let params = getLocation(gpsSource, destination, speed,{age,weight,heartRate,time:oldTime.time,sex});
        if(deepEqual(params.source,destination)){
            clearInterval(time);
            return;
        }
        getMongoDB((error, db) => {
            if (error) {
              /*do nothing */
            }
            let update={
                $set:{
                    "location.coordinates":[params.source.lng,params.source.lat]
                }
            }
            return mongoUpdate('gps_location', {imei},update, db);
        });
        emitUpdates(imei, {
            ...params,
            imei
        });

    }, 10000);
    writeJSONResponse(res, {
        updateSocekt: true
    });

})


const getLocation = (source, destination, speed,calories) => {
    let {lat: sourceLat, lng: sourceLng} = source;
    let {lat: destinationLat, lng: destinationLng} = destination;
    let distanceKm = getDistanceFromLatLonInKm(sourceLat, sourceLng, destinationLat, destinationLng);
    let timeAndCalories = getTotalTimeTakenAndCalories(distanceKm, speed,calories);
    return {
        source,
        destination,
        ...timeAndCalories
    };
}
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
