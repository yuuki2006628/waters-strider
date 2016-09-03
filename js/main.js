(function(){
	var RANGE = 50,
		N = 20;
	var width = window.innerWidth,
		height = window.innerHeight,
		canvas,
		context,
		water_striders = [];

	function WaterStrider(x,y){
		this.x = x;
		this.y = y;
		this.size = 5;
		this.step = Math.random()*5;
	}
	WaterStrider.prototype.update = function(timestamp) {
		
	};

	function init(){
		console.log("start demo");
		canvas = document.getElementById( "canvas" );
		context = canvas.getContext( "2d" );
		canvas.width = width;
		canvas.height = height;
		for (var i = 0; i < N; i++) {
			var wx = Math.random()*width,
				wy = Math.random()*height;
			var water_strider = new WaterStrider(wx,wy);
			water_striders.push(water_strider);
		}
		onFrame();
	}

	var _frame = null,
		timestamp = 0;
	function onFrame(){
		_frame = requestAnimationFrame(onFrame);
		++timestamp;
		context.clearRect(0,0,width,height);

	}
})();