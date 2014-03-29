
var $container = $('[data-js="container"]');
var $nav = $('[data-js="nav"]');
var $nav_fb = $('[data-js="nav-fb-login"]');
var $nav_upload = $('[data-js="nav-album-upload"]');

var $content = $('[data-js="content"]');
var $page_fb = $('[data-js="page-fb-login"]');
var $page_upload = $('[data-js="page-album-upload"]');

/* -------------------
 * Callback functions
 */

// Called when the Facebook login is successful
function fbLoginComplete() {
	$nav_fb.removeClass("active");
	$nav_upload.addClass("active");
	$page_fb.hide();
	$page_upload.show();
}

function login() {
    fbLoginComplete();
    FB.api('/me/photos', function (response) {
        files = [];
        console.log(response);
        for (var i = 0; i<response.data.length; i++) {
            var curr = response.data[i];
            console.log(curr.source);
            files.push({url: curr.source});
        }
        console.log('files', files);
        options = {};
        options['files'] = files;
        Dropbox.save(options);
    });
}
