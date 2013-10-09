// Handle loading of all external scripts (and even maybe some external CSS)
Modernizr.load([
    // Default load for jquery
    {
        load: '//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js',
        complete: function() {
            if( !window.jQuery ) {
                Modernizr.load('/scripts/vendor/jquery-1.10.1.min.js');
            }
        }
    },

    // Load some custom tests
    {
        load: ['/scripts/addons/test-placeholder.js', '/scripts/addons/test-positionfixed.js']
    },

    // If there is no support for media queries, load a polyfill to fix it
    {
        test: Modernizr.mq('only all'),
        nope: ['/scripts/vendor/respond.min.js']
    },

    // Load a polyfill for placeholder attributes
    {
        test: Modernizr.customPlaceHolderTest(),
        nope: ['/scripts/addons/polyfill-placeholder.js']
    },

    // Load default items
    {
        load: ['/scripts/site.js']
    }
]);
