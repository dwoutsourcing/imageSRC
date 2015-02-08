# imageSRC
imageSRC, a jQuery plugin to add any source type (either dataURL, File object or string) with progress event

Sample usage:

'''
$('img')
	.on('progress', function(event, originalEvent, perc, loaded, total) {
		console.log(arguments);
	})
	.on('load', function(event, originalEvent) {
		console.log(arguments);
	})
	.src(file)
;
'''

Where file is either a File instance, a dataURL string or a string value.