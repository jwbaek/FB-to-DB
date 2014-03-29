$(document).ready(function(){

	// Grab the window elements
	var $container = $('[data-js="container"]');
	var $nav = $('[data-js="nav"]');
	var $nav_fb = $('[data-js="nav-fb-login"]');
	var $nav_db = $('[data-js="nav-db-login"]');
	var $nav_upload = $('[data-js="nav-album-upload"]');

	var $content = $('[data-js="content"]');
	var $page_fb = $('[data-js="page-fb-login"]');
	var $page_db = $('[data-js="page-db-login"]');
	var $page_upload = $('[data-js="page-album-upload"]');

	// Add event listeners

	// Upon being logged into Facebook
	// Transition from fb-login to db-login



});

function login() {
    console.log('LOGIN TEST');
    FB.api('/me/photos', function (response) {
        console.log(response, 'HI');
    });
}