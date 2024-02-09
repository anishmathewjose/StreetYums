mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'show-map', // container ID
    style: 'mapbox://styles/anishmathewjose/clsf0wd7r008101qxffpy226i', // style URL
    center: vendor.geometry.coordinates, // starting position [lng, lat]
    zoom: 15, // starting zoom
    minZoom: 14
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: "#AA4A44" })
    .setLngLat(vendor.geometry.coordinates)
    .addTo(map)