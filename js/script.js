/** @jsx React.DOM */
var $container = $('[data-js="container"]');

var $content = $('[data-js="content"]');
var $page_fb = $('[data-js="page-fb-login"]');
var $page_upload = $('[data-js="page-album-upload"]');

window.fbAsyncInit = function() {
      FB.init({appId: '458180437615708', status: true, cookie: true,
               xfbml: true});

      // Check if user is connected already
      // Hide/show login button accordingly
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            $page_upload.show();
        } else {
            $page_upload.hide();
        }
      });

      FB.api('/me/photos', function(response) {
        console.log('RESPONSE:', response);
      });

    };
    (function() {
      var e = document.createElement('script');
      e.type = 'text/javascript';
      e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
      e.async = true;
      document.getElementById('fb-root').appendChild(e);
    }());

/* -------------------
 * Callback functions
 */

// Called when the Facebook login is successful
function fbLoginComplete() {
	$page_upload.show();
}

// each object has a url and a thumbnail_url
var PHOTO_OBJECTS = [];
var THUMB_TO_URL = {};

function login() {
    fbLoginComplete();
    FB.api('/me/photos', function (response) {
        // response.data has all the data
        var files = [];
        for (var i = 0; i<response.data.length; i++) {
            var curr = response.data[i];
            var url = curr.source;
            var thumbnail_url = curr.images[curr.images.length-1].source;
            files.push({url: url, filename: 'FacebookPhoto'+i});
            PHOTO_OBJECTS.push({
                url:url,
                thumbnail_url:thumbnail_url,
            });
            THUMB_TO_URL[thumbnail_url] = url;
        }
        load_thumbnails();
        options = {};
        options['files'] = files;
    });
}

var load_thumbnails = function() {
    console.log('LOADING thumbnail')
    var arr = PHOTO_OBJECTS;
    var album_container = document.getElementById("jackie");
    var arr_len = arr.length;
    var arr_thumbs = []
    for (var i = 0; i < arr_len; i++) {
        var source = arr[i].thumbnail_url;
        arr_thumbs[i] = <option data-img-src={source} value={i}>hi</option>

    }
    React.renderComponent(
        <div>{arr_thumbs}</div>,
        album_container
        );
    $("select").imagepicker();
};

function save_to_dropbox() {
    var selected_photos = $('.selected img');
    var urls = [];
    for (var i = 0; i<selected_photos.length; i++) {
        var curr = selected_photos[i];
        var thumbnail_url = $(curr).attr('src');
        var url = THUMB_TO_URL[thumbnail_url];
        urls.push(url);
    }

    var files = []; // to put into dropbox API
    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        files.push({url: url, filename: 'FacebookPhoto'+i+'.jpg'});
    }
    options = {};
    options['files'] = files;
    Dropbox.save(options);
}
