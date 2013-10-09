;(function(Modernizr, window) {
    // Example for checking if placeholder is supported
    Modernizr.addTest('customPlaceHolderTest', function() {
        var test = document.createElement('input');
        return ('placeholder' in test);
    });
})(Modernizr, window);
