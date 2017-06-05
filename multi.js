mapboxgl.accessToken = 'pk.eyJ1IjoiYWhnbm95IiwiYSI6ImZIcGRiZjgifQ.pL1SaB8gHyl-L2yolSl5Qw';


var maps = [];
var current_id = 0;
var current_zoom = 12;
var map_size = 400;

addCity("Detroit, USA");
addCity("Seoul, Korea");
addCity("Paris, France");

function addCity(query){
    var map_id = current_id;
    current_id += 1;
    $("#container").append(
        $("<div>", {'id':'container_' + map_id, 'class':'city'}));
    var map = createMap(map_id);
    var map_info = {'id':map_id, 'map':map};
    updateMapSize(map_info);
    maps.push(map_info);
    addr_search(map_info, query);
}

function createMap(map_id){
    $("#container_" + map_id)
        .append($('<div>', {'class':'map', 'id':"mapbox_" + map_id}));
    var map = new mapboxgl.Map({
        container: "mapbox_" + map_id,
        style: 'mapbox://styles/ahgnoy/cixpb7f3q001x2sojafk0x4af',
        center: [-83.74, 42.28],
        minZoom: 3,
        zoom: current_zoom
    });
    map.on("zoomend", function(){
        current_zoom = map.getZoom();
        maps.map(
            function(m){
                m.map.setZoom(current_zoom)
            }
        );
        updateZoomSlider(current_zoom);
    });    
    return map;
}

function addCityClick(){
    var inp = $('#main_search').val();
    addCity(inp);
}



function addr_search(map_info, query) {
    $.getJSON('https://nominatim.openstreetmap.org/search?format=json&limit=5&q=' + query, function(data) {
        console.log(data[0]);
        if (data[0]) {
            map_info.display_name = data[0].display_name;
            map_info.map.panTo(
                {lat:Number(data[0].lat), lng:Number(data[0].lon)}
            );
        } else {
            map_info.display_name = "Cannot find the city"
        }
        addInfo(map_info);
   });
}

function addInfo(map_info) {
    console.log(map_info);
    $("#container_" + map_info.id).append(
        $('<h5>')
        .addClass("text-center")
        .addClass("city-info")
        .html(map_info.display_name)
        .append($('<button>', {'class':'btn btn-default btn-xs'})
            .html('x')
            .click(function(){
                $("#container_" + map_info.id).remove()
            })
        )
    );
}

function zoomUpdate(value) {
    current_zoom = value;
    maps.map(
        function(m){
            m.map.setZoom(current_zoom)
        }
    );
    $("#globalZoomOutput").html(value);
}

function updateZoomSlider(value){
    var round_val = Math.round(value * 100) / 100
    $("#globalZoom").val(round_val);
    $("#globalZoomOutput").html(round_val);
}

function updateMapsSize(value) {
    map_size = value;
    maps.map(updateMapSize);
    $("#mapSizeOutput").html(value);
}

function updateMapSize(map_info) {
    //var div = $("#mapbox_" + map_info.id);
    $(".map")
        .css("width", map_size)
        .css("height", map_size);
    map_info.map.resize();
    $(".city-info")
        .css("width", map_size);
}
