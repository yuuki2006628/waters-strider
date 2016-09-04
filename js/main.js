(function(){
	var RANGE = 30,
		N = 30,
		TIMERAG = 200,
		SIZE = 10;
	var width = window.innerWidth,
		height = window.innerHeight,
		canvas,
		context,
		water_striders = [],
		is_enemy = false,
		mouse_posi = {
			x:0,
			y:0
		};

	document.onmousedown = function(e){
		is_enemy = true;
		mouse_posi = {
			x:e.clientX,
			y:e.clientY
		};
	}
	
	document.onmouseup = function(e){
		is_enemy = false;
		mouse_posi = {
			x:0,
			y:0
		};
	}

	function WaterStrider(x,y){
		this.x = x;
		this.y = y;
		this.vx = 2*RANGE*Math.random()-RANGE;
		this.vy = 2*RANGE*Math.random()-RANGE;
		this.ex = [];
		this.ey = [];
		this.rapple = [];
		this.size = SIZE;
		this.step = Math.random()*TIMERAG;
		this.color = get_random_color();
	}

	WaterStrider.prototype.update = function(timestamp) {
		++this.step;
		if (this.x > width- RANGE || this.y > height- RANGE) {
			this.vx = Math.random()*RANGE*-1;
			this.vy = Math.random()*RANGE*-1;
			this.ex.push(this.x);
			this.ey.push(this.y);
			this.rapple.push(0);
			this.x += this.vx;
			this.y += this.vy;
		}
		if (this.x < RANGE || this.y < RANGE) {
			this.vx = Math.random()*RANGE;
			this.vy = Math.random()*RANGE;
			this.ex.push(this.x);
			this.ey.push(this.y);
			this.rapple.push(0);
			this.x += this.vx;
			this.y += this.vy;
		}
		if (this.step > TIMERAG) {
			this.vx = 2*RANGE*Math.random()-RANGE;
			this.vy = 2*RANGE*Math.random()-RANGE;
			this.step = 0;
			this.ex.push(this.x);
			this.ey.push(this.y);
			this.rapple.push(0);
			this.x += this.vx;
			this.y += this.vy;
		}
		if (is_enemy) {
			var d = destanceTo(this.x,this.y,mouse_posi.x,mouse_posi.y)
			if (d < 100) {
				this.step = 50;
				var v = vector(this.x,this.y,mouse_posi.x,mouse_posi.y);
				this.vx = -v.x/d * RANGE * Math.random();
				this.vy = -v.y/d * RANGE * Math.random();
				this.ex.push(this.x);
				this.ey.push(this.y);
				this.rapple.push(0);
				this.x += this.vx;
				this.y += this.vy;
			}
		}
		var rapple = this.step / TIMERAG * RANGE;
		draw_rapple(this.x,this.y,rapple,this.color,1/rapple);
		for (var i = 0; i < this.ex.length; i++) {
			++this.rapple[i];
			draw_rapple(this.ex[i],this.ey[i],this.rapple[i]/i,this.color,1/this.rapple[i]);
		}
		draw_vector(this.x,this.y,
					this.x+this.vx,
					this.y+this.vy,this.color);
		draw(this.x,this.y,this.size,this.color);
	};

	WaterStrider.prototype.bump = function() {
		for (var i = 0; i < water_striders.length; i++) {
			var obj = water_striders[i]
			if (this != obj) {
				var d = destanceTo(this.x,this.y,obj.x,obj.y);
				if (d < RANGE) {
					var v = vector(this.x,this.y,obj.x,obj.y);
					this.vx = v.x * -1;
					this.vy = v.y * -1;
					this.ex.push(this.x);
					this.ey.push(this.y);
					this.rapple.push(0);
					this.x += this.vx;
					this.y += this.vy;
				}
			}
		}
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

	function draw(x,y,size,color){
		context.beginPath();
		context.arc(x,y,size,0,Math.PI*2,false);
		context.fillStyle = color;
		context.strokeStyle = color;
		context.fill()
	}
	function draw_rapple(x,y,size,color,lw){
		context.beginPath();
		context.arc(x,y,size,0,Math.PI*2,false);
		context.strokeStyle = color;
		context.lineWidth = lw;
		context.stroke();
	}
	function draw_vector(cx,cy,vx,vy,color){
		context.beginPath();
		context.moveTo(cx,cy);
		context.lineTo(vx,vy);
		context.lineWidth = 1;
		context.strokeStyle = color;
		context.stroke();
	}

	function get_random_color(){
		var h = Math.random()*100;
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
			water_striders[i].bump();
		}
	}
	init();
})();