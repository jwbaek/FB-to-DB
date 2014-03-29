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
