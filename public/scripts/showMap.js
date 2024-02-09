mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: vendor.geometry.coordinates, // starting position [lng, lat]
    zoom: 15, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: "#AA4A44", scale: 0.75 })
    .setLngLat(vendor.geometry.coordinates)
    .addTo(map)