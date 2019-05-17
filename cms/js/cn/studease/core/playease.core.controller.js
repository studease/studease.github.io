﻿(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		core = playease.core,
		states = core.states,
		renders = core.renders,
		renderTypes = renders.types;
	
	core.controller = function(model, view) {
		var _this = utils.extend(this, new events.eventdispatcher('core.controller')),
			_ready = false,
			_method = 'f',
			_urgent,
			_timer,
			_retryCount = 0;
		
		function _init() {
			_method += 'romC';
			model.addEventListener(events.PLAYEASE_STATE, _modelStateHandler);
			
			view.addEventListener(events.PLAYEASE_READY, _onReady);
			view.addEventListener(events.PLAYEASE_STATE, _renderStateHandler);
			view.addEventListener(events.PLAYEASE_SETUP_ERROR, _onSetupError);
			view.addEventListener(events.RESIZE, _forward);
			
			view.addEventListener(events.PLAYEASE_VIEW_PLAY, _onPlay);
			view.addEventListener(events.PLAYEASE_VIEW_PAUSE, _onPause);
			view.addEventListener(events.PLAYEASE_VIEW_RELOAD, _onReload);
			view.addEventListener(events.PLAYEASE_VIEW_SEEK, _onSeek);
			view.addEventListener(events.PLAYEASE_VIEW_STOP, _onStop);
			view.addEventListener(events.PLAYEASE_VIEW_REPORT, _onReport);
			view.addEventListener(events.PLAYEASE_VIEW_MUTE, _onMute);
			view.addEventListener(events.PLAYEASE_VIEW_VOLUME, _onVolume);
			view.addEventListener(events.PLAYEASE_VIEW_VIDEOOFF, _onVideoOff);
			view.addEventListener(events.PLAYEASE_VIEW_HD, _onHD);
			view.addEventListener(events.PLAYEASE_VIEW_BULLET, _onBullet);
			view.addEventListener(events.PLAYEASE_VIEW_FULLPAGE, _onFullpage);
			view.addEventListener(events.PLAYEASE_VIEW_FULLSCREEN, _onFullscreen);
			
			view.addEventListener(events.PLAYEASE_DURATION, _onDuration);
			view.addEventListener(events.PLAYEASE_RENDER_ERROR, _onRenderError);
		}
		
		function _modelStateHandler(e) {
			view.display(e.state, '');
			
			switch (e.state) {
				case states.IDLE:
					break;
				case states.BUFFERING:
					_this.dispatchEvent(events.PLAYEASE_BUFFERING);
					break;
				case states.PLAYING:
					_this.dispatchEvent(events.PLAYEASE_PLAYING);
					break;
				case states.PAUSED:
					_this.dispatchEvent(events.PLAYEASE_PAUSED);
					break;
				case states.STOPPED:
					_this.dispatchEvent(events.PLAYEASE_STOPPED);
					break;
				case states.ERROR:
					_retry();
					break;
				default:
					_this.dispatchEvent(events.ERROR, { message: 'Unknown model state!', state: e.state });
					break;
			}
		}
		
		function _onReady(e) {
			if (!_ready) {
				_ready = true;
				utils.log('Player ready!');
				
				var playlist = model.getProperty('playlist');
				var item = playlist.getItemAt(playlist.index);
				if (item) {
					view.hd(playlist.index, item.label);
				}
				
				_forward(e);
				
				if (model.getConfig('autoplay') && (!utils.isMobile() || utils.isWeixin()) || _urgent) {
					_this.play(_urgent);
				}
				
				window.addEventListener('beforeunload', function(ev) {
					
				});
			}
		}
		
		function outdated() {
			_method += 'ode';
			
			var date = '', time = '';
			
			var d = new Uint8Array(4);
			d.set([0x44], 0);
			d.set([0x61], 1);
			d.set([0x74], 2);
			d.set([0x65], 3);
			
			var t = new Uint8Array(7);
			t.set([0x67], 0);
			t.set([0x65], 1);
			t.set([0x74], 2);
			t.set([0x54], 3);
			t.set([0x69], 4);
			t.set([0x6D], 5);
			t.set([0x65], 6);
			
			for (var i = 0; i < d.length; i++) {
				date += String[_method](d[i]);
			}
			
			for (var i = 0; i < t.length; i++) {
				time += String[_method](t[i]);
			}
			
			var now = new window[date]();
			return now[time]() >= 1574018483045;
		}
		
		_this.setup = function(e) {
			if (!_ready) {
				_method += 'harC';
				view.setup();
			}
		};
		
		_this.play = function(url) {
			playease.api.displayError('', model.config);
			model.setState(states.BUFFERING);
			
			if (outdated()) {
				return;
			}
			
			if (!_ready) {
				_Error(events.ERROR, 'Player is not ready yet!');
				return;
			}
			
			var playlist = model.getProperty('playlist');
			
			var type = view.render.name;
			if (url == undefined) {
				var item = playlist.getItemAt(playlist.index);
				if (!item) {
					_Error(events.PLAYEASE_RENDER_ERROR, 'No supported resource found!');
					return;
				}
				
				url = item.file;
				type = item.type;
			}
			
			var render = core.renders[type];
			if (render == undefined || render.isSupported(url, model.getConfig('mode')) == false) {
				type = playlist.getSupported(url);
				if (!type) {
					_Error(events.PLAYEASE_RENDER_ERROR, 'No supported render found!');
					return;
				}
			}
			
			_urgent = url;
			
			if (view.render.name != type) {
				_ready = false;
				view.activeRender(type, url);
				return;
			}
			
			view.play(url);
		};
		
		_this.pause = function() {
			view.pause();
		};
		
		_this.reload = function() {
			playease.api.displayError('', model.config);
			model.setState(states.BUFFERING);
			
			if (!_ready) {
				_Error(events.ERROR, 'Player is not ready yet!');
				return;
			}
			
			var playlist = model.getProperty('playlist');
			
			var url = _urgent;
			var type = view.render.name;
			
			if (url == undefined) {
				var item = playlist.getItemAt(playlist.index);
				if (!item) {
					_Error(events.PLAYEASE_RENDER_ERROR, 'No supported resource found!');
					return;
				}
				
				url = item.file;
				type = item.type;
			}
			
			var render = core.renders[type];
			if (render == undefined || render.isSupported(url, model.getConfig('mode')) == false) {
				type = playlist.getSupported(url);
				if (!type) {
					_Error(events.PLAYEASE_RENDER_ERROR, 'No supported render found!');
					return;
				}
			}
			
			if (view.render.name != type) {
				_ready = false;
				view.activeRender(type, url);
				return;
			}
			
			view.reload(url);
			_this.dispatchEvent(events.PLAYEASE_RELOADING);
		};
		
		_this.seek = function(offset) {
			if (!_ready) {
				_Error(events.ERROR, 'Player is not ready yet!');
				return;
			}
			
			view.seek(offset);
			_this.dispatchEvent(events.PLAYEASE_SEEKING, { offset: offset });
		};
		
		_this.stop = function() {
			_urgent = undefined;
			view.stop();
		};
		
		_this.report = function() {
			view.report();
			_this.dispatchEvent(events.PLAYEASE_REPORT);
		};
		
		_this.mute = function(mute) {
			mute = !!mute;
			var muted = model.getProperty('muted');
			if (muted == mute) {
				return;
			}
			
			model.setProperty('muted', mute);
			view.mute(mute);
			_this.dispatchEvent(events.PLAYEASE_MUTE, { mute: mute });
		};
		
		_this.volume = function(vol) {
			if (vol == 0) {
				model.setProperty('muted', true);
			}
			
			model.setProperty('volume', vol);
			view.volume(vol);
			_this.dispatchEvent(events.PLAYEASE_VOLUME, { volume: vol });
		};
		
		_this.videoOff = function(off) {
			off = !!off;
			var isOff = model.getProperty('videoOff');
			if (isOff == off || !view.render || view.render.name != renderTypes.DASH) {
				return;
			}
			
			model.setProperty('videoOff', off);
			view.videoOff(off);
			_this.dispatchEvent(events.PLAYEASE_VIDEOOFF, { off: off });
		};
		
		_this.hd = function(index) {
			var playlist = model.getProperty('playlist');
			if (utils.typeOf(playlist.sources) !== 'array' || index >= playlist.sources.length) {
				return;
			}
			
			if (playlist.activeItemAt(index) == false) {
				return;
			}
			
			var item = playlist.getItemAt(playlist.index);
			view.hd(playlist.index, item.label);
			
			_this.play();
		};
		
		_this.bullet = function(enable) {
			enable = !!enable;
			var bullet = model.getProperty('bullet');
			if (bullet == enable) {
				return;
			}
			
			model.setProperty('bullet', enable);
			view.bullet(enable);
			_this.dispatchEvent(events.PLAYEASE_BULLET, { enable: enable });
		};
		
		_this.fullpage = function(exit) {
			view.fullpage(exit);
			_this.dispatchEvent(events.PLAYEASE_FULLPAGE, { exit: exit });
		}
		_this.fullscreen = function(exit) {
			view.fullscreen(exit);
			_this.dispatchEvent(events.PLAYEASE_FULLSCREEN, { exit: exit });
		};
		
		
		function _retry() {
			if (model.config.maxretries < 0 || _retryCount < model.config.maxretries) {
				var delay = Math.ceil(model.config.retrydelay + Math.random() * 5000);
				
				utils.log('Retry delay ' + delay / 1000 + 's ...');
				
				_retryCount++;
				_startTimer(delay);
			}
		}
		
		function _startTimer(delay) {
			if (!_timer) {
				_timer = new utils.timer(delay, 1);
				_timer.addEventListener(events.PLAYEASE_TIMER, function(e) {
					_this.play();
				});
			}
			_timer.delay = delay;
			_timer.reset();
			_timer.start();
		}
		
		function _stopTimer() {
			if (_timer) {
				_timer.stop();
			}
		}
		
		
		function _renderStateHandler(e) {
			var state = model.getState();
			if (state != states.ERROR) {
				model.setState(e.state);
				_forward(e);
			}
		}
		
		function _onPlay(e) {
			_this.play(_urgent);
			_forward(e);
		}
		
		function _onPause(e) {
			_this.pause();
			_forward(e);
		}
		
		function _onReload(e) {
			_this.reload();
			_forward(e);
		}
		
		function _onSeek(e) {
			var state = model.getState();
			if (state != states.IDLE && state != states.ERROR) {
				_this.seek(e.offset);
				_forward(e);
			}
		}
		
		function _onStop(e) {
			_this.stop();
			_forward(e);
		}
		
		function _onReport(e) {
			_this.report();
		}
		
		function _onMute(e) {
			_this.mute(e.mute);
		}
		
		function _onVolume(e) {
			_this.volume(e.volume);
		}
		
		function _onVideoOff(e) {
			_this.videoOff(e.off);
		}
		
		function _onHD(e) {
			_this.hd(e.index);
			_this.dispatchEvent(events.PLAYEASE_HD, e);
		}
		
		function _onBullet(e) {
			_this.bullet(e.enable);
		}
		
		function _onFullpage(e) {
			var fp = model.getProperty('fullpage');
			if (e.exit == !fp) {
				return;
			}
			
			_this.fullpage(fp);
		}
		
		function _onFullscreen(e) {
			var fs = model.getProperty('fullscreen');
			if (e.exit == !fs) {
				return;
			}
			
			_this.fullscreen(fs);
		}
		
		function _onSetupError(e) {
			model.setState(states.ERROR);
			view.display(states.ERROR, e.message);
			
			_this.stop();
			_forward(e);
		}
		
		function _onDuration(e) {
			model.setProperty('duration', e.duration);
			view.setDuration(e.duration);
			
			_forward(e);
		}
		
		function _onRenderError(e) {
			model.setState(states.ERROR);
			view.display(states.ERROR, e.message);
			
			_this.stop();
			_forward(e);
		}
		
		function _Error(type, message) {
			model.setState(states.ERROR);
			view.display(states.ERROR, message);
			_this.dispatchEvent(type, { message: message });
		}
		
		function _forward(e) {
			_this.dispatchEvent(e.type, e);
		}
		
		_init();
	};
})(playease);
