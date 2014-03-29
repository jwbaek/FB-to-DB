
var $container = $('[data-js="container"]');

var $content = $('[data-js="content"]');
var $page_fb = $('[data-js="page-fb-login"]');
var $page_upload = $('[data-js="page-album-upload"]');

/* -------------------
 * Callback functions
 */

// Called when the Facebook login is successful
function fbLoginComplete() {
	$page_fb.hide();
	$page_upload.show();
}

var PHOTO_OBJECTS = [];


function login() {
    fbLoginComplete();
    FB.api('/me/photos', function (response) {
        // response.data has all the data
        var files = [];
        console.log(response);
        $("select").imagepicker();
        for (var i = 0; i<response.data.length; i++) {
            var curr = response.data[i];
            var url = curr.source;
            files.push({url: url, filename: 'FacebookPhoto'+i});
            console.log(url);
            PHOTO_OBJECTS.push({
                url:url,
                thumbnail_url:curr.images[curr.images.length-1].source
            });
        }
        console.log('files', files);
        console.log('OBJECTS', PHOTO_OBJECTS);
        options = {};
        options['files'] = files;
        Dropbox.save(options);
    });
}

function save_to_dropbox(urls) {
    var files = [];
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        files.push({url: url, filename: 'FacebookPhoto'+i});
    }
    options = {};
    options['files'] = files;
    Dropbox.save(options);
}
