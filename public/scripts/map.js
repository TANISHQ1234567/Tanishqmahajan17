
maptilersdk.config.apiKey = mapToken;

const fetchdata = async () => {
    const result = await maptilersdk.geocoding.forward(mapLocation);
    // console.log(result.features[0]);
    return result.features[0].center;
}


const main = async () => {

    const center = await fetchdata();
    // console.log(center);
    
    const map = new maptilersdk.Map({
        container: 'map',
        style: maptilersdk.MapStyle.HYBRID,
        center: center,
        zoom: 11.7,
    });
    const marker = new maplibregl.Marker()
    .setLngLat(center)
    .addTo(map); 
    map.on('error', function(err) {
        throw new Error("To load the map, you must replace YOUR_MAPTILER_API_KEY_HERE first, see README");
    });    
    
}

main();