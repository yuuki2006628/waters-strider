(function(){
	var RANGE = 60,
		N = 10,
		TIMERAG = 200;
	var width = window.innerWidth,
		height = window.innerHeight,
		canvas,
		context,
		water_striders = [];

	function WaterStrider(x,y){
		this.x = x;
		this.y = y;
		this.vx = 2*RANGE*Math.random()-RANGE;
		this.vy = 2*RANGE*Math.random()-RANGE;
		this.size = 5;
		this.step = Math.random()*TIMERAG;
		this.color = get_random_color();
	}

	WaterStrider.prototype.update = function(timestamp) {
		++this.step;
		if (this.step > TIMERAG) {
			this.step = 0;
			for (var i = 0; i < water_striders.length; i++) {
				var obj = water_striders[i];
				if (obj != this) {
					var d = destanceTo(this.x,this.y,obj.x,obj.y);
					if (d < 5) {
						var v = vector(this.x,this.y,obj.x,obj.y);
						this.vx = v.x * -1;
						this.vy = v.y * -1;
					}
				}
			}
			if (this.x > width- RANGE || this.y > height- RANGE) {
				this.vx = Math.random()*RANGE*-1;
				this.vy = Math.random()*RANGE*-1;
			}
			if (this.x < RANGE || this.y < RANGE) {
				this.vx = Math.random()*RANGE;
				this.vy = Math.random()*RANGE;
			}
			this.x += this.vx;
			this.y += this.vy;
		}else{
			var rapple = this.step / TIMERAG * RANGE;
			draw(this.x,this.y,rapple,this.color,false);
		}
		draw(this.x,this.y,this.size,this.color,true);
	};

	function destanceTo(x1,y1,x2,y2){
		var dx = x2 - x1,
			dy = y2 - y1;
		return Math.sqrt(dx*dx + dy*dy);
	}


	function vector(x1,y1,x2,y2){
		return {
			x:x2-x1,
			y:y2-y1
		};
	}
	function draw(x,y,size,color,isFill){
		context.beginPath();
		context.arc(x,y,size,0,Math.PI*2,false);
		context.fillStyle = color;
		context.strokeStyle = color;
		isFill ? context.fill() : context.stroke();
	}

	function get_random_color(){
		var h = Math.random()*360;
		return 'hsl('+h+',100%,50%)';
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