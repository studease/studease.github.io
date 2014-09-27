var slicease;

window.onload = function(){
	slicease = new Slicease();
	var markfunc = new Func();
	markfunc.setup(markIndex);
	var config = {canvas_id: 'canvas', 
		images: ['images/contents/img1.png', 'images/contents/img2.png', 'images/contents/img3.png'], 
		pieces: [5, 4, 6],
		mark_func: markfunc
	};
	slicease.setup(config);
	slicease.init();
	slicease.play();
	
	var se_prev = document.getElementById('se_prev');
	se_prev.onclick = function(event){
		slicease.prev();
	};
	var se_next = document.getElementById('se_next');
	se_next.onclick = function(event){
		slicease.play();
	};
	
	
	var scroll_btn = document.getElementById('scroll_btn');
	scroll_btn.onclick = function(){
		var left = document.body.scrollLeft || document.documentElement.scrollLeft;
		window.scrollTo(left, 0);
	};
};

function play(n){
	if(slicease != null){
		slicease.play(n);
	}
}
function markIndex(index){
	if(index < 0){
		return;
	}
	
	for(var i=0; i<slicease.images.length; i++){
		var a = document.getElementById('indx_' + i);
		if(a == null){
			continue;
		}
		
		if(i == index){
			a.style.background = '#cccccc';
			continue;
		}
		
		a.style.background = '#999999';
	}
}

window.onscroll = function(){
	var top = document.body.scrollTop || document.documentElement.scrollTop;
	var nav = document.getElementById('nav-bar');
	if(top > 36){
		nav.style.position = 'fixed';
		nav.style.top = '0px';
	}
	else{
		nav.style.position = 'static';
	}
	
	var scroll_btn = document.getElementById('scroll_btn');
	if(top > 50){
		scroll_btn.style.display = 'inline';
	}
	else{
		scroll_btn.style.display = 'none';
	}
};

