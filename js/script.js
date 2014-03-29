/** @jsx React.DOM */
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

// each object has a url and a thumbnail_url
var PHOTO_OBJECTS = [];

function login() {
    fbLoginComplete();
    FB.api('/me/photos', function (response) {
        // response.data has all the data
        var files = [];
        console.log(response);
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
        load_thumbnails();
        options = {};
        options['files'] = files;
        Dropbox.save(options);
    });
}

var load_thumbnails = function() {
    console.log('LOADING thumbnail')
    var arr = PHOTO_OBJECTS;
    console.log(arr);
    var album_container = document.getElementById("jackie");
    var arr_len = arr.length;
    var arr_thumbs = []
    for (var i = 0; i < arr_len; i++) {
        var source = arr[i].thumbnail_url;
        console.log(source);

        arr_thumbs[i] = <option data-img-src={source} value={i}>hi</option>

    }
    React.renderComponent(
        <div>{arr_thumbs}</div>,
        album_container
        );
    $("select").imagepicker();
};

function save_to_dropbox() {
    var urls = [];
    for (var i = 0; i<PHOTO_OBJECTS.length; i++) {
        var obj = PHOTO_OBJECTS[i];
        urls.push(obj.url);
    }
    var files = [];
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        files.push({url: url, filename: 'FacebookPhoto'+i});
    }
    options = {};
    options['files'] = files;
    Dropbox.save(options);
}
