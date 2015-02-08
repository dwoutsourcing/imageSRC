/*
 * Author: dwoutsourcing (dwoutsourcing@gmail.com)
 * License: MIT
 */
(function($, undefined) {
	function getSourceType(source) {
		var type;
		
		if(/^data:image/.test(source))
			type = 'dataURL';
		else {
			if(typeof source == 'string')
				type = 'path';
			else if(source.name)
				type = 'localFile';
		}
		
		return type;
	}
	
	function initializeLoader($loader, $scope) {
		return $loader
					.on('progress', function(event, originalEvent, perc, loaded, total) {
						$scope.trigger('progress', [originalEvent, perc, loaded, total]);
					})
					.on('loadstart', function(event, originalEvent) {
						$scope.trigger('loadstart', [originalEvent]);
					})
					.on('loadend', function(event, originalEvent, result) {
						$scope.trigger('loadend', [originalEvent, result]);
					})
					.on('error', function(event, originalEvent, result) {
						$scope.trigger('error');
					})
				;
	}
	
	$.fn.extend({
		src: function(source) {
			var sourceType = getSourceType(source);
			var $loader;
			
			this.each(function() {
				var $this = $(this);
				$this.data('dw-source-type', sourceType);
				
				switch(sourceType) {
					case 'dataURL':
						this.src = source;
						break;
						
					case 'path':
						if($.canLoadData()) {
							$loader = initializeLoader($.dataLoader(), $this)
										.on('load', function(event, originalEvent, response) {
											var blob = new Blob([response]);
											var result = window.URL.createObjectURL(blob);
											
											$this.attr('src', result);
										})
										.loadData(source, null, 'arraybuffer')
									;
						}
						else
							this.src = source;
						break;
						
					case 'localFile':
						$loader = initializeLoader($.fileReader(), $this)
									.on('load', function(event, originalEvent, result) {
										$this.attr('src', result);
									})
									.readAsDataURL(source)
								;
						break;
						
				}
				
				$this.abort = function() {
					if($loader)
						$loader.abort();
				};
			});
		}
	});
}( jQuery ));