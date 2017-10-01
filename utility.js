var ObjConstructor = {}.constructor;
export function parseRequest(req) {
    let object = Object.assign({}, req.body, req.params, req.query);
    for(var key in object){
        object[key] = parseJSON(object[key]);
    }
    return object;
}
export function parseJSON(json,isError) {
    try{
        json = JSON.parse(json);
    }catch(error) {
        if(isError){
            throw error;
        }
    }
    return json;
}

export function makeGpsData(data) {
    return data.reduce((p, c) => {
        let location = c.location;
        delete c.location;
        p.push(Object.assign({},c,{
            lat: location.coordinates[1],
            lng: location.coordinates[0]
        }));
        return p;
    },[]);

}

export function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1);
    var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg) {
    return deg * (Math.PI/180)
}

export function getTotalTimeTakenAndCalories(distance,speed) {
    if(!speed){
        return;

    }
    let time = distance / speed;
    return {
        time,
        speed,calories:1
    }
}




var isJSONObject = (obj)=> {
    if (obj === undefined || obj === null || obj === true || obj === false || typeof obj !== "object" || Array.isArray(obj)) {
        return false;
    } else if (obj.constructor === ObjConstructor || obj.constructor === undefined) {
        return true;
    } else {
        return false;
    }
};

export function deepEqual (first, second)  {
    if (!first || !second) {
        return first === second;
    }
    if (first === second) {
        return true;
    } else if ((Array.isArray(first)) && (Array.isArray(second))) {
        var firstLength = first.length;
        var secondLength = second.length;
        if (firstLength !== secondLength) {
            return false;
        } else {
            for (var i = 0; i < firstLength; i++) {
                if (!deepEqual(first[i], second[i])) {
                    return false
                }
            }
            return true;
        }
    } else if ((typeof first === typeof second) && typeof first === "number" && isNaN(first) && isNaN(second)) {
        return true;
    } else if (first instanceof Date && second instanceof Date) {
        if (first.getTime() === second.getTime()) {
            return true;
        } else {
            return false;
        }

    } else if (isJSONObject(first) && isJSONObject(second)) {
        var firstKeys = Object.keys(first);
        var secondKeys = Object.keys(second);
        if (firstKeys.length !== secondKeys.length) {
            return false;
        } else {
            for (var i = 0; i < firstKeys.length; i++) {
                var keyName = firstKeys[i];
                if (!deepEqual(first[keyName], second[keyName])) {
                    return false;
                }
            }
            return true;
        }
    } else if (first.toString && second.toString && first.toString() === second.toString()) {
        /*Check to validate objectid case from effects,on server check for objectId*/
        return true;
    } else {
        return false;
    }
}

export function readGPSLocation(){
    var fs = require('fs');
    var rawFile=fs.readFileSync(`${process.cwd()}/gps_location.txt`, "utf-8");
    let data = rawFile.split("\n");
    let gps_location = [];
    for(var i=0;i<data.length;i=i+3){
        gps_location.push({
            place:parseJSON(data[i+0]),
            lat: parseJSON(data[i+1]),
            lng: parseJSON(data[i+2])

        });
    }
    return gps_location;


}