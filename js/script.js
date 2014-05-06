/** @jsx React.DOM */
var $container = $('[data-js="container"]');

var $content = $('[data-js="content"]');
var $page_fb = $('[data-js="page-fb-login"]');
var $page_upload = $('[data-js="page-album-upload"]');

var APP_ID = '458180437615708';


$page_upload.hide();
window.fbAsyncInit = function() {
      if (APP_ID == null) {
        throw 'Need a Facebook app ID.'
      }
      FB.init({appId: APP_ID, status: true, cookie: true,
               xfbml: true});

      // Check if user is connected already
      // Hide/show login button accordingly
      FB.getLoginStatus(function(response) {
        if (response.status === 'connected') {
            get_facebook_photos();
        } else {
            $page_upload.hide();
        }
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

// each object has a url and a thumbnail_url
var PHOTO_OBJECTS = [];
var THUMB_TO_URL = {};

function login() {
  FB.getLoginStatus(function(response) {
    if (response.status === 'connected') {
        $page_upload.show();
        get_facebook_photos();
    } else {
        $page_upload.hide();
    }
  });
}

function get_facebook_photos() {
    var target = document.getElementById('spinner');
    var spinner = new Spinner().spin(target);
    // var spinner = new Spinner().spin();
    target.appendChild(spinner.el);
    FB.api('/me/photos', function (response) {
        // response.data has all the data
        for (var i = 0; i<response.data.length; i++) {
            var curr = response.data[i];
            var url = curr.source;
            var thumbnail_url = curr.images[curr.images.length-1].source;
            PHOTO_OBJECTS.push({
                url:url,
                thumbnail_url:thumbnail_url,
            });
            THUMB_TO_URL[thumbnail_url] = url;
        }
        spinner.stop()
        load_thumbnails();
    });
}

var load_thumbnails = function() {
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
    $page_upload.show();
    $('#jackie').show();
    $("select").imagepicker();
};

function on_all(selected) {
    $("#jackie > option").each(function() {
        $(this).prop('selected', selected);
    });
    $("select").imagepicker();
}


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
        var currTime = Math.floor(new Date().getTime()/1000);
        files.push({url: url, filename: 'FB2DB-'+currTime+'-'+i+'.jpg'});
    }
    options = {};
    options['files'] = files;
    Dropbox.save(options);
}
