/** Converts numeric degrees to radians */
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}
function distance(x,y){
    var R = 6371; // km
    var dLat = (y.lat-x.lat).toRad(); 
    var dLon = (y.lng-x.lng).toRad(); 
   
    var lat1 = x.lat.toRad();
    var lat2 = y.lat.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c;
    return d*1000;
}

var LineEditor = function(map,markers){
    
    this.map = map;
    this.markers = markers;
    this.editEnable=false;
    
    this.options = {
        hoverThreshold : 50
    }
    
    this.lines = [];
    
    this._closestPoint = function(latlng,thres){
        var points = [];
        $(this.markers).each(function(){
            var pos = this.marker._latlng;
            var dist = pos.distanceTo(latlng);
            if(dist < thres) points.push({maker : this, d : dist,pos : this.marker._latlng});
        })
        
        points.sort(function(a,b){
            if(a.d == b.d) return 0;
            if(a.d < b.d) return -1;
            else return 1;
        })
    
        var sliceAmount = 10;
        if(points.length >= sliceAmount){
            points = points.slice(0,sliceAmount);
        }
        
        var _self = this;
        $(_self.lines).each(function(){
            _self.map.removeLayer(this)
        })
        
        $(points).each(function(){
            _self.lines.push(L.polyline([latlng,this.pos], {color: 'red'}).addTo(_self.map));
        })
    }
    
};
            
LineEditor.prototype.setEdit = function(val){
    var lastState = this.editEnable;
    if(val == true) this.editEnable = true;
    else this.editEnable = false;
                
    if(lastState != this.editEnable){
        if(!this.editEnable){
            var _self = this;
            $(_self.lines).each(function(){
                _self.map.removeLayer(this)
            })
        }
    }
}

LineEditor.prototype.checkMouseHover = function(e){
    if(!this.editEnable) return;
    var bounds = this.map.getBounds(); 
    var dist = bounds.getNorthWest().distanceTo(bounds.getSouthEast());
    this._closestPoint(e.latlng,dist / 50);
}


