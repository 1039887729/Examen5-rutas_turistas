angular.module('rutasApp', [])
.controller('MainCtrl', ['$http', '$timeout', function($http, $timeout){
  const vm = this;
  vm.ciudades = [];
  vm.tipos = [];
  vm.rutas = [];
  vm.paradas = [];
  vm.selectedCity = null;
  vm.selectedRoute = null;
  vm.showAddRoute = false;
  vm.showAddParada = false;
  vm.editingRoute = false;
  vm.editingParada = false;
  vm.routeForm = {};
  vm.paradaForm = {};
  vm.map = null;
  vm.mapRouteLayer = null;

  vm.loadCities = function(){
    $http.get('/api/ciudades/').then(r => vm.ciudades = r.data);
  };

  vm.loadTipos = function(){
    $http.get('/api/tipos/').then(r => vm.tipos = r.data);
  };

  vm.loadRoutes = function(idCiudad){
    $http.get('/api/rutas/ciudad/' + idCiudad).then(r => vm.rutas = r.data);
  };

  vm.selectCity = function(c){
    vm.selectedCity = c;
    vm.loadRoutes(c.id);
    vm.selectedRoute = null;
    vm.paradas = [];
    vm.clearMap();
    vm.map = null;
    vm.mapRouteLayer = null;
    vm.hideForms();
  };

  vm.prepareAddRoute = function(){
    if (!vm.selectedCity) return;
    vm.showAddRoute = true;
    vm.editingRoute = false;
    vm.routeForm = { nombre: '', descripcion: '', tipoId: null };
  };

  vm.selectRoute = function(ruta){
    vm.selectedRoute = ruta;
    vm.loadParadas(ruta.id);
    vm.hideForms();
  };

  vm.saveRoute = function(){
    const payload = {
      id: vm.editingRoute ? vm.routeForm.id : 0,
      nombre: vm.routeForm.nombre,
      descripcion: vm.routeForm.descripcion,
      ciudad: { id: vm.selectedCity.id },
      tipo: { id: vm.routeForm.tipoId }
    };
    const promise = vm.editingRoute
      ? $http.put('/api/rutas/', payload)
      : $http.post('/api/rutas/', payload);
    promise.then(()=>{
      vm.loadRoutes(vm.selectedCity.id);
      vm.cancelRoute();
    });
  };

  vm.editRoute = function(r){
    vm.editingRoute = true;
    vm.showAddRoute = true;
    vm.routeForm = {
      id: r.id,
      nombre: r.nombre,
      descripcion: r.descripcion,
      tipoId: r.tipo && r.tipo.id
    };
  };

  vm.cancelRoute = function(){
    vm.showAddRoute=false;
    vm.editingRoute=false;
    vm.routeForm = {};
  };

  vm.deleteRoute = function(id){
    if(confirm('Eliminar ruta?')) {
      $http.delete('/api/rutas/'+id).then(()=>{
        if (vm.selectedCity) vm.loadRoutes(vm.selectedCity.id);
        if (vm.selectedRoute && vm.selectedRoute.id === id) {
          vm.selectedRoute = null;
          vm.paradas = [];
          vm.clearMap();
        }
      });
    }
  };

  vm.loadParadas = function(idRuta){
    $http.get('/api/paradas/ruta/' + idRuta).then(r => {
      vm.paradas = r.data.sort((a,b)=>a.orden - b.orden);
      $timeout(function() {
        vm.$updateMap();
      }, 100);
    });
  };

  vm.prepareAddParada = function(){
    if (!vm.selectedRoute) return;
    vm.showAddParada = true;
    vm.editingParada = false;
    vm.paradaForm = { nombre:'', descripcion:'', latitud:'', longitud:'', orden:'', tiempo:'' };
  };

  vm.saveParada = function(){
    const payload = {
      id: vm.editingParada ? vm.paradaForm.id : 0,
      orden: vm.paradaForm.orden,
      nombre: vm.paradaForm.nombre,
      ruta: { id: vm.selectedRoute.id },
      longitud: vm.paradaForm.longitud,
      latitud: vm.paradaForm.latitud,
      tiempo: vm.paradaForm.tiempo,
      descripcion: vm.paradaForm.descripcion
    };
    const promise = vm.editingParada
      ? $http.put('/api/paradas/', payload)
      : $http.post('/api/paradas/', payload);
    promise.then(()=>{
      vm.loadParadas(vm.selectedRoute.id);
      vm.cancelParada();
    });
  };

  vm.editParada = function(p){
    vm.editingParada=true;
    vm.showAddParada=true;
    vm.paradaForm = angular.copy(p);
  };

  vm.cancelParada = function(){
    vm.showAddParada=false;
    vm.editingParada=false;
    vm.paradaForm = {};
  };

  vm.deleteParada = function(id){
    if(confirm('Eliminar parada?')) {
      $http.delete('/api/paradas/'+id).then(()=>vm.loadParadas(vm.selectedRoute.id));
    }
  };

  vm.hideForms = function(){
    vm.showAddRoute = false;
    vm.editingRoute = false;
    vm.showAddParada = false;
    vm.editingParada = false;
  };

  vm.initMap = function(){
    if (vm.map) return;
    if (typeof L === 'undefined') {
      console.log('Leaflet not loaded yet, retrying...');
      $timeout(vm.initMap, 200);
      return;
    }
    var mapElement = document.getElementById('routeMap');
    if (!mapElement) {
      console.log('routeMap element not found, retrying...');
      $timeout(vm.initMap, 200);
      return;
    }
    console.log('Initializing map...');
    vm.map = L.map('routeMap').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(vm.map);
    vm.mapRouteLayer = L.layerGroup().addTo(vm.map);
    console.log('Map initialized successfully');
  };

  vm.clearMap = function(){
    if (vm.mapRouteLayer) {
      try {
        vm.mapRouteLayer.clearLayers();
      } catch(e) {
        console.log('Error clearing map layers:', e);
      }
    }
    if (vm.map) {
      try {
        vm.map.remove();
      } catch(e) {
        console.log('Error removing map:', e);
      }
    }
  };

  vm.$updateMap = function(){
    if (!vm.paradas || !vm.paradas.length) {
      vm.clearMap();
      return;
    }
    
    $timeout(function() {
      if (!vm.map) {
        vm.initMap();
      }
      $timeout(function() {
        vm.clearMap();
        var latlngs = vm.paradas.map(function(p) {
          var lat = parseFloat(p.latitud);
          var lng = parseFloat(p.longitud);
          var marker = L.circleMarker([lat, lng], { 
            radius: 8, 
            color: '#007bff', 
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.7
          }).bindPopup('<strong>' + p.nombre + '</strong><br/>Orden: ' + p.orden + '<br/>Tiempo: ' + (p.tiempo || 0) + ' min');
          marker.addTo(vm.mapRouteLayer);
          return [lat, lng];
        });

        if (latlngs.length > 1) {
          L.polyline(latlngs, { color: '#28a745', weight: 4, opacity: 0.7 }).addTo(vm.mapRouteLayer);
        }

        if (latlngs.length) {
          try {
            vm.map.fitBounds(latlngs, { padding: [50, 50] });
          } catch(e) {
            console.log('Map fit bounds error:', e);
          }
        }
      }, 100);
    }, 100);
  };

  vm.loadCities();
  vm.loadTipos();
}]);
