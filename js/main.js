(function(){
	var RANGE = 30,
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
		this.step = Math.random()*50;
	}
	WaterStrider.prototype.update = function(timestamp) {
		++this.step;
		if (this.step > 50) {
			this.step = 0;
			var nx = this.x + RANGE*2*Math.random()-RANGE,
				ny = this.y + RANGE*2*Math.random()-RANGE;
			this.x = nx;
			this.y = ny;
			draw(nx,ny,this.size);
		}else{
			draw(this.x,this.y,this.size);
		}

	};

	function draw(x,y,size){
		context.beginPath();
		context.arc(x,y,size,0,Math.PI*2,false);
		context.fillStyle = "#FFF";
		context.fill();
	}

	function init(){
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
		for (var i = 0; i < water_striders.length; i++) {
			water_striders[i].update();
		}
	}
	init();
})();