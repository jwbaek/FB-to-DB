// empty

// FB.api(path, method, params, callback)
// https://developers.facebook.com/docs/javascript/reference/FB.api

function login_test() {
    console.log('LOGIN TEST');
    FB.api('/me/photos', function (response) {
        console.log(response, 'HI');
    });
}
