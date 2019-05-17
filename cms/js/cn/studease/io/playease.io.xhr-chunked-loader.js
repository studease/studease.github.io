﻿(function(playease) {
	var utils = playease.utils,
		events = playease.events,
		io = playease.io;
	
	io['xhr-chunked-loader'] = function(config) {
		var _this = utils.extend(this, new events.eventdispatcher('utils.xhr-chunked-loader')),
			_defaults = {
				method: 'GET',
				headers: {},
				mode: io.modes.CORS,
				credentials: io.credentials.OMIT,
				cache: io.caches.DEFAULT,
				redirect: io.redirects.FOLLOW,
				chunkSize: 0,
				responseType: io.responseTypes.TEXT
			},
			_state,
			_url,
			_xhr,
			_range,
			_fileSize;
		
		function _init() {
			_this.name = io.types.XHR_CHUNKED_LOADER;
			
			_this.config = utils.extend({}, _defaults, config);
			
			_state = io.readyStates.UNINITIALIZED;
			_range = { start: 0, position: 0, last: 0, end: '' };
			_fileSize = Number.MAX_VALUE;
		}
		
		_this.load = function(url, start, end) {
			_url = url;
			
			if (!io[_this.name].isSupported(url)) {
				_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + _this.name + ' is not supported.' });
				return;
			}
			
			_xhr = new XMLHttpRequest();
			_xhr.open(_this.config.method, _url, true);
			_xhr.responseType = _this.config.responseType;
			_xhr.onreadystatechange = _onXHRReadyStateChange;
			_xhr.onprogress = _onXHRProgress;
			_xhr.onload = _onXHRLoad;
			_xhr.onerror = _onXHRError;
			
			switch (_this.config.credentials) {
				case io.credentials.INCLUDE:
					_xhr.withCredentials = true;
					break;
				case io.credentials.SAME_ORIGIN:
					_xhr.withCredentials = window.location.host == utils.getOrigin(_url);
					break;
				default:
					_xhr.withCredentials = false;
			}
			
			if (start || end) {
				_range.start = _range.position = start;
				_range.end = Math.min(end, _fileSize);
				
				if (_range.position - 1 >= _range.end) {
					return;
				}
			}
			
			if (_range.start || _range.end || _this.config.chunkSize) {
				_range.last = Math.min(_range.end, _range.position + _this.config.chunkSize - 1);
				utils.extend(_this.config.headers, {
					Range: 'bytes=' + _range.position + '-' + _range.last
				});
			}
			
			utils.foreach(_this.config.headers, function(key, value) {
				_xhr.setRequestHeader(key, value);
			});
			
			_xhr.send();
		};
		
		function _onXHRReadyStateChange(e) {
			_state = _xhr.readyState;
			
			if (_xhr.readyState == io.readyStates.SENT) {
				if (_xhr.status != 416 && (_xhr.status < 200 || _xhr.status >= 300)) {
					_this.dispatchEvent(events.ERROR, { message: 'Loader error: Invalid http status(' + _xhr.status + ' ' + _xhr.statusText + ').' });
				}
			}
		}
		
		function _onXHRProgress(e) {
			/* void */
		}
		
		function _onXHRLoad(e) {
			var data, len;
			
			switch (_xhr.responseType) {
				case io.responseTypes.ARRAYBUFFER:
					var arr = new Uint8Array(_xhr.response);
					data = arr.buffer;
					len = data.byteLength;
					break;
					
				case io.responseTypes.BLOB:
					// TODO: read blob.
					break;
					
				default:
					data = _xhr.response;
					len = data.length;
					break;
			}
			
			if (_xhr.status >= 200 && _xhr.status < 300) {
				_range.position += len;
				_this.dispatchEvent(events.PLAYEASE_PROGRESS, { data: data });
			}
			
			if (!_this.config.headers.Range || _xhr.status == 416 || _range.position - 1 < _range.last) {
				_fileSize = _range.position;
				_this.dispatchEvent(events.PLAYEASE_CONTENT_LENGTH, { length: _fileSize });
			}
			
			if (!_this.config.headers.Range || _xhr.status == 416 || _range.position - 1 < _range.last || _range.position - 1 >= _range.end) {
				_this.dispatchEvent(events.PLAYEASE_COMPLETE);
				return;
			}
			
			// Load next chunk
			_xhr.open(_this.config.method, _url, true);
			
			_range.last = Math.min(_range.end, _range.position + _this.config.chunkSize - 1);
			utils.extend(_this.config.headers, {
				Range: 'bytes=' + _range.position + '-' + _range.last
			});
			
			utils.foreach(_this.config.headers, function(key, value) {
				_xhr.setRequestHeader(key, value);
			});
			
			_xhr.send();
		}
		
		function _onXHRError(e) {
			_this.dispatchEvent(events.ERROR, { message: 'Loader error: ' + e.message });
		}
		
		_this.abort = function() {
			_state = io.readyStates.DONE;
			
			if (_xhr) {
				_xhr.abort();
			}
		};
		
		_this.state = function() {
			return _state;
		};
		
		_init();
	};
	
	io['xhr-chunked-loader'].isSupported = function(file) {
		var protocol = utils.getProtocol(file);
		if (protocol != 'http' && protocol != 'https') {
			return false;
		}
		
		return true;
	};
})(playease);
