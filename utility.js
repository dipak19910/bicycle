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