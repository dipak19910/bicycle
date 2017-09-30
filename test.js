var data={
    "html_attributions" : [],
    "results" : [
        {
            "geometry" : {
                "location" : {
                    "lat" : 21.2568028,
                    "lng" : 81.63495279999999
                },
                "viewport" : {
                    "northeast" : {
                        "lat" : 21.25815178029151,
                        "lng" : 81.6363017802915
                    },
                    "southwest" : {
                        "lat" : 21.2554538197085,
                        "lng" : 81.63360381970848
                    }
                }
            },
            "icon" : "https://maps.gstatic.com/mapfiles/place_api/icons/restaurant-71.png",
            "id" : "fb50fec6207235476d451be1010b077c7bd261d6",
            "name" : "Neelkanth Restaurant",
            "photos" : [
                {
                    "height" : 715,
                    "html_attributions" : [
                        "\u003ca href=\"https://maps.google.com/maps/contrib/101327341617632307340/photos\"\u003eshrikant soni\u003c/a\u003e"
                    ],
                    "photo_reference" : "CmRaAAAAkA1mhO02NOGdfaXVWa2nc41WaNYrNRd-PC1U-SUnkMx4FQR4pxUg1ANQ7sYDqhh6LGL1HldQlUb1mhAC7Sz15dHAlzfxcbjW2iJoSs8cky26NUqQbzCKPeVftpyCESDQEhDOm7Z6zCaMCNS2NhenuleNGhRK1rMwWdGeTC6E7Kd0Q3oSvolvPQ",
                    "width" : 484
                }
            ],
            "place_id" : "ChIJO3Y0wI_dKDoRLDr5RcunZfM",
            "rating" : 4.2,
            "reference" : "CmRSAAAACwu0cTL4ZQw8RBr5-2OZKuAFhDv5yscCUFft6ad5GOVKs7Be1wlU55NM8A4t5oXn5ETFWPmCuq4K8cW2OIyzMtplK6-Cv_7Ut9u0i4ZbzV6ry4oUr4o_LaoieEZPESffEhBE9okzyYxiMjQwf3R2GPx_GhTPF1TBAwR5bttsZA5RvqPB_dtFpw",
            "scope" : "GOOGLE",
            "types" : [ "restaurant", "food", "point_of_interest", "establishment" ],
            "vicinity" : "Balaji Nagar, Raipur"
        }
    ],
    "status" : "OK"
}
data = data.results;
var jsonData = [];
for(var row of data){
    jsonData.push(
        {
            location:{
                coordinates:[row.geometry.location.lng,row.geometry.location.lat],
                type:"Point"
            },
            name:row.name,
            imei:row.id
        }
    )
}
console.log(JSON.stringify(jsonData));