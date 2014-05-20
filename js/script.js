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

// each photo object has a url and a thumbnail_url
var PAGE_TO_PHOTO = {};
var THUMBNAIL_TO_PHOTO = {};
var NEXT_PAGE_URL = '';
var CURRENT_PAGE = 1;
var SPINNER = null;

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

function get_older_photos() {
    CURRENT_PAGE++;
    return get_photos_for_page(CURRENT_PAGE, NEXT_PAGE_URL);
}

function get_newer_photos() {
    CURRENT_PAGE--;
    return get_photos_for_page(CURRENT_PAGE);
}

function get_photos_for_page(n, url) {
    // disable 'previous' button if on first page
    if (n == 1) {
        $('#previous').hide();
    } else {
        $('#previous').show();
    }

    // spin spinner!
    var target = document.getElementById('spinner');
    SPINNER = new Spinner().spin(target);
    target.appendChild(SPINNER.el);

    // don't load photos again if already there
    if (PAGE_TO_PHOTO[n]) {
        load_thumbnails();
    } else {
        $.ajax({url:url, success:process_facebook_response});
    }
}

function get_facebook_photos() {
    var target = document.getElementById('spinner');
    SPINNER = new Spinner().spin(target);
    target.appendChild(SPINNER.el);
    FB.api('/me/photos', process_facebook_response);
}

// add photos from response to PAGE_TO_PHOTO object
function process_facebook_response(response) {
    console.log(response)
    NEXT_PAGE_URL = response.paging.next;
    PAGE_TO_PHOTO[CURRENT_PAGE] = []
    // response.data has all the data
    for (var i = 0; i<response.data.length; i++) {
        var curr = response.data[i];
        var url = curr.images[0].source;
        var thumbnail_url = curr.images[curr.images.length-1].source;
        var photo = {
            url:url,
            thumbnail_url:thumbnail_url,
            id:curr.id,
        }
        PAGE_TO_PHOTO[CURRENT_PAGE].push(photo);
        THUMBNAIL_TO_PHOTO[thumbnail_url] = photo;
    }
    load_thumbnails();
}

// load thumbnails for current page
var load_thumbnails = function() {
    SPINNER.stop()
    var arr = PAGE_TO_PHOTO[CURRENT_PAGE];
    var album_container = document.getElementById("jackie");
    album_container.innerHTML = "";  // clear what was there previously
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
    var photos = [];
    for (var i = 0; i<selected_photos.length; i++) {
        var curr = selected_photos[i];
        var thumbnail_url = $(curr).attr('src');
        var photo = THUMBNAIL_TO_PHOTO[thumbnail_url];
        photos.push(photo);
    }

    var files = []; // to put into dropbox API
    for (var i = 0; i < photos.length; i++) {
        var photo = photos[i];
        files.push({url: photo.url, filename: 'FB2DB-'+photo.id+'.jpg'});
    }
    options = {};
    options['files'] = files;
    Dropbox.save(options);
}
