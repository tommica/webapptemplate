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
        load: ['/scripts/addons/test-placeholder.js', '/scripts/addons/test-positionfixed.js'],
        complete: function() {

            // Finally load the core polyfills, fixes and other important files
            Modernizr.load([
                // If there is no support for media queries, load a polyfill to fix it
                {
                    test: Modernizr.mq('only all'),
                    nope: ['/scripts/vendor/respond.min.js']
                },

                // Load a polyfill for html5 webforms (testing for placeholder is good as any)
                {
                    test: !Modernizr.customplaceholdertest,
                    nope: {'webshim': '/scripts/vendor/js-webshim/minified/polyfiller.js'},
                    callback: {
                        'webshim': function() {
                            $(document).ready(function() {
                                $.webshims.setOptions({
                                    "basePath": "/scripts/vendor/js-webshim/minified/shims/",
                                    "waitReady": false
                                });
                                $.webshims.polyfill('forms');
                            });
                        }
                    }
                }
            ]);
        }
    },

    // Load default items
    {
        load: ['/scripts/site.js']
    }
]);
