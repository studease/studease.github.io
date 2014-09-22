window.onload = function(){
	var scroll_btn = document.getElementById('scroll_btn');
	scroll_btn.onclick = function(){
		var left = document.body.scrollLeft || document.documentElement.scrollLeft;
		window.scrollTo(left, 0);
	};
	
	var slicease = new Slicease();
	slicease.setup({canvId:'canvas', images:['images/contents/img1.png', 'images/contents/img2.png', 'images/contents/img3.png'], pieces:[4, 5, 3]});
	var slicbox = document.getElementById('slicease');
	slicbox.onclick = function(event){
		var doc = document.body || document.documentElement;
		var index = (event.clientX < doc.clientWidth/2) ? slicease.img_p : slicease.img_n;
		slicease.init();
		slicease.run(index);
	};
};

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

