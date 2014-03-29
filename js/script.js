// empty

// FB.api(path, method, params, callback)
// https://developers.facebook.com/docs/javascript/reference/FB.api

function example() {
    FB.api('/me/photos', function(response) {
        console.log(response);
    });
}

example()
console.log('test');
