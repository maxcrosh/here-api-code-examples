
// инициализируем платформу с ID и Кодом приложения 
var platform = new H.service.Platform({
  app_id: 'TBDjSb7P7zIirbfww4jT',
  app_code: 'TysyptsFjJv-ceJwXGoYmw',
  useCIT: true,
  useHTTPS: true
});

// Получаем спислк картографических основ (спутник, вектор)
var defaultLayers = platform.createDefaultLayers({lg:"RUS"});

/* Инициализируем объект карты с аргументами: 
		контейнер где необходимо отобразить карту, 
		тип базовой карты,
		опции
*/
var map = new H.Map(document.getElementById('map'),
  defaultLayers.normal.map,{
  	center:{
  		"lat":47.21623,
  		"lng":39.63069
  	},
  	zoom:17
  });

var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

// Создаем стаедартный пользовательский интерфейс
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Изменение размера карты в зависимости от изменения размеров окна
window.addEventListener('resize',function(){
	map.getViewPort().resize()
});


var explore = new H.places.Explore(platform.getPlacesService());

let markerGroup = new H.map.Group();
map.addObject(markerGroup);

map.addEventListener('tap', (e) => {

  markerGroup.removeObjects(markerGroup.getObjects());
  
  let coords = map.screenToGeo(e.currentPointer.viewportX, e.currentPointer.viewportY);
  
  let marker = new H.map.Marker(new H.geo.Point(coords.lat, coords.lng),{
    content:"Местоположение"
  });

  let circle = new H.map.Circle({"lat":coords.lat, "lng":coords.lng},300);
  markerGroup.addObject(circle);

  markerGroup.addObject(marker);
  
  var params = {
    'in': coords.lat + "," + coords.lng +";"+"r=300",
    'cat':"eat-drink"
  };


  explore.request(params,{},(data) =>{
  
    data.results.items.forEach((point)=>{
 
      var POI = new H.map.Marker({lat:point.position[0],lng:point.position[1]},{icon:new H.map.Icon(point.icon)});
      POI.setData({
        "data":point.title
      });

      var bubble;

      POI.addEventListener('pointerenter',function(e){

        bubble =  new H.ui.InfoBubble(e.target.getPosition(), {
          content: e.target.getData().data
        });
      
        ui.addBubble(bubble);

      });    

      POI.addEventListener('pointerleave',function(e){
        ui.removeBubble(bubble);
      }); 

      markerGroup.addObject(POI);
    })

  },(error) =>{console.log(error)})

})


