
var WTF = (function() {

    'use strict';

    /*
      ------------------------------------------------------------

        Constants & variables

      ------------------------------------------------------------
    */

    var RE_QUOTE = /\"([^\"]+)\"/gi;
    var RE_JSON = /\.json$/i;
    var RE_KEY = /[a-z0-9_-]{32,}/i;
    var DOCS_PATH = 'https://docs.google.com/spreadsheet/pub?key={key}&output=csv';

    var templates;
    var responses;
    var headings;
    var corpus;
    var regex;
    var dom;

    /*
      ------------------------------------------------------------

        Called once initialisation as finished

      ------------------------------------------------------------
    */

    function start() {
        
        // Copy out templates then remove from corpus

        templates = corpus.template;
        responses = corpus.response;
        headings = corpus.heading;

        delete corpus.template;
        delete corpus.response;
        delete corpus.heading;

        // Enable UI and generate first idea

        initUI();
        buildRexExp();
        generate();
    }

    /*
      ------------------------------------------------------------

        Converts CSV to a regular corpus object
        @see sample.json

      ------------------------------------------------------------
    */

    function parseCSV( csv ) {

        var corpus = {};

        var i, j, k, n, m, cols, keys = {}, data = {}, rows = csv.split( '\n' );

        for ( i = 0, n = rows.length; i < n; i++, j = i - 1 ) {

            cols = rows[ i ].replace( RE_QUOTE, escape ).split( ',' );

            for ( k = 0, m = cols.length; k < m; k++ ) {

                if ( i === 0 ) {

                    data[ keys[ k ] = cols[ k ].toLowerCase() ] = [];

                } else if ( cols[ k ] ) {

                    data[ keys[ k ] ][ j ] = unescape( cols[ k ] ).replace( /^\"|\"$/g, '' );
                }
            }
        }

        return data;
    }

    /*
      ------------------------------------------------------------

        Binds event handlers to control the interface

      ------------------------------------------------------------
    */

    function initUI() {

        $( '.loading' ).remove();

        dom = {
            generate: $( '#generate' ),
            elevator_pitch: $( '#elevator_pitch' ),
            traction: $( '#traction'),
            market: $( '#market'),
            problem: $( '#problem' ),
            product: $( '#product' ),
            business_model: $( '#business_model' ),
            strategy: $( '#strategy' ),
            team: $( '#team' ),
            financials: $( '#financials' ),
            competition: $( '#competition' ),
            investment: $( '#investment' )
        };

        dom.generate.click( function() {
            generate();
            return false;
        });
    }

    /*
      ------------------------------------------------------------

        Builds a regular expression for all types in the corpus

      ------------------------------------------------------------
    */

    function buildRexExp() {

        var types = [];

        for ( var type in corpus )

            types.push( type );

        var content = '@(type)'.replace( 'type', types.join( '|' ) );

        regex = new RegExp( content, 'gi' );
    }

    /*
      ------------------------------------------------------------

        Generates ideas based on the corpus

      ------------------------------------------------------------
    */

    function generate() {

        var placeholder, key, word, market, iter = 0, // Safety mechanism
            // idea = randomItem( templates ),
            idea = templates[0],
            item = regex.exec( idea ),
            copied_corpus = cloneCorpus();
        var object;
        var name = "";

        while ( item && ++iter < 1000 ) {

            placeholder = item[ 0 ]; // has form "@X"
            key = item[ 1 ]; // has form "X"

            // object is an object with attribute "name", etc.
            object = randomItem( copied_corpus[ key ], true);
            word = object.name;
            name += randomItem(object.affixes);

            // to account for nested JSON array of which "X" is the key
            if (key === "X") {
                market = object.market;
            }
            else if (key === "Y") {
            }
            console.log(name);

            idea = idea.replace( placeholder, word );

            regex.lastIndex = 0;
            item = regex.exec( idea );
        }

        // Update slides
        //dom.generate.text( randomItem( responses ));
        dom.generate.text(responses[0])

        dom.elevator_pitch.html(
            '<p><small>Improve your pitching skills! Convince your mates that your startup is the next ' +
            randomItem( copied_corpus.next ) + '. Ready?</small></p>' +
            '<h1>' + name + '</h1>' +
            '<h3>A ' + idea + '</h3>'

        );

        dom.traction.html(
            '<p>' + market + '<p>'
        );

        /*
        // Toggle animation
        setTimeout( showOutput, 0 );
        hideOutput();
        */
    }

    function hideOutput() {

        dom.slide1.removeClass( 'animate' ).css( 'opacity', 0 );
    }

    function showOutput() {

        dom.slide1.addClass( 'animate' ).css( 'opacity', 1 );
    }

    function randomItem( list, remove ) {

        var index = ~~( Math.random() * list.length );
        var item = list[ index ];

        if ( remove )

            list.splice( index, 1 );

        return item;
    }

    function cloneCorpus() {

        var copy = {};

        for ( var key in corpus )

            copy[ key ] = corpus[ key ].concat();
        
        return copy;
    }

    /*
      ------------------------------------------------------------

        Public API

      ------------------------------------------------------------
    */

    return {

        /*

            Expects one of the following:

                1.  An object with `templates` and any amount of keys for word types, for example:
        
                    {
                        templates: [ 'The @color @animal', 'The @animal was @color' ],
                        animal: [ 'dog', 'cat', 'rabbit' ],
                        color: [ 'red', 'green', 'blue' ],
                    }

                2.  A path to a JSON file with the same structure as above (see `sample.json`)

                3.  A Google spreadsheet key (e.g 0AvG1Hx204EyydF9ub1M2cVJ3Z1VGdDhTSWg0ZV9LNGc)
                    You must first publish the spreadsheet as a CSV 
                    @see https://support.google.com/drive/answer/37579?hl=en

        */

        init: function( data ) {

            if ( !data ) throw data + ' is not a valid corpus';

            if ( typeof data === 'string' ) {

                if ( RE_JSON.test( data ) ) {

                    // JSON

                    $.ajax({
                        url: data,
                        dataType: 'json',
                        success: function( data, status, xhr ) {
                            corpus = data;
                            start();
                        },
                        error: function( xhr, errorType, error ) {
                            throw 'Cannot load JSON data: ' + error;
                        }
                    });

                } else if ( RE_KEY.test( data ) ) {

                    // CSV

                    $.ajax({
                        url: DOCS_PATH.replace( '{key}', data ),
                        success: function( data, status, xhr ) {
                            corpus = parseCSV( data );
                            start();
                        },
                        error: function( xhr, errorType, error ) {
                            throw 'Cannot load spreadsheet. Is it published? (@see https://support.google.com/drive/answer/37579?hl=en)';
                        }
                    });

                } else {

                    throw 'Unrecognised data format: ' + data;
                }

            } else if ( typeof data === 'object' ) {

                // Object

                corpus = data;
                start();
            }
        },

        // Expose certain methods

        generate: generate
    };

})();
