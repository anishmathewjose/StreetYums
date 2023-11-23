mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: vendor.geometry.coordinates, // starting position [lng, lat]
    zoom: 17, // starting zoom
    minZoom: 10
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker({ color: "#AA4A44", scale: 0.75 })
    .setLngLat(vendor.geometry.coordinates)
    .addTo(map)