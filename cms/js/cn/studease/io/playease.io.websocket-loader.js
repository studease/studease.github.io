﻿(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io;
	
	io['websocket-loader'] = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.websocket-loader')),
			_defaults = {
				method: 'GET',
				headers: {},
				mode: io.modes.CORS,
				credentials: io.credentials.OMIT,
				cache: io.caches.DEFAULT,
				redirect: io.redirects.FOLLOW
			},
			_state,
			_url,
			_websocket;
		
		function _init() {
			_this.name = io.types.WEBSOCKET_LOADER;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_state = io.readyStates.UNINITIALIZED;
		}
		
		_this.load = function(url, start, end) {
			_url = url;
			
			if (!io[_this.name].isSupported(url)) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + _this.name + ' is not supported.' });
				return;
			}
			
			window.WebSocket = window.WebSocket || window.MozWebSocket;
			if (window.WebSocket) {
				_websocket = new WebSocket(_url);
				_websocket.binaryType = 'arraybuffer';
				
				_websocket.onopen = _onOpen;
				_websocket.onmessage = _onMessage;
				_websocket.onerror = _onError;
				_websocket.onclose = _onClose;
			}
			
			if (!_websocket) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: Failed to initialize websocket.' });
				return;
			}
			
			//_websocket.send();
		};
		
		function _onOpen(e) {
			_state = io.readyStates.SENT;
		}
		
		function _onMessage(e) {
			var data = new Uint8Array(e.data);
			_this.dispatchEvent(events.PLAYEASE_PROGRESS, { data: data.buffer });
		}
		
		function _onError(e) {
			_state = io.readyStates.UNINITIALIZED;
			_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
		}
		
		function _onClose(e) {
			_state = io.readyStates.UNINITIALIZED;
			_this.dispatchEvent(events.PLAYEASE_COMPLETE);
		}
		
		_this.abort = function() {
			_state = io.readyStates.UNINITIALIZED;
			
			if (_websocket && (_websocket.readyState == WebSocket.CONNECTING || _websocket.readyState == WebSocket.OPEN)) {
				_websocket.close();
			}
		};
		
		_this.state = function() {
			return _state;
		};
		
		_init();
	};
	
	io['websocket-loader'].isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'ws' && protocol != 'wss') {
			return false;
		}
		
		if (utils.isMSIE('(8|9)')) {
			return false;
		}
		
		return true;
	};
})(playease);
