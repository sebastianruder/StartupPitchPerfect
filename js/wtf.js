
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

        delete corpus.template;
        delete corpus.response;

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
            market: $( '#market'),
            problem: $( '#problem' ),
            product: $( '#product' ),
            revenue: $( '#revenue' ),
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
            cp_corp = cloneCorpus(),
            object, customers, sale, name = "", competitor1 = "", competitor2 = "", competitor3 = "",
            revenue1, revenue2, revenue3, finance1, finance2, finance3;

        while ( item && ++iter < 1000 ) {

            placeholder = item[ 0 ]; // has form "@X"
            key = item[ 1 ]; // has form "X"

            // object is an object with attribute "name", etc.
            object = randomItem(cp_corp[ key ], true);
            word = object.name;

            // only "X" has market attribute
            if (key === "X") {
                market = object.market;

                // add killer as product name pitch
                cp_corp.product.push(word + "-killer");
                console.log( cp_corp.product);
            }
            else if (key === "Y") {

                if (!name.endsWith(" ")) {
                    // "ly" and "io" are popular startup suffixes
                    object.affixes.push("ly");
                    object.affixes.push("io");
                }
                // slice copies array without reference
                var words = object.words.slice(0);
                // set new revenue chart labels, draw new revenue chart
                revenue1 = randomItem(words, true); revenue2 = randomItem(words, true); revenue3 = randomItem(words, true);
                revenueChartData.labels = [revenue1, revenue2, revenue3];
                var revenue_chart = new Chart(document.getElementById("revenue_chart").getContext("2d")).Bar(
                    revenueChartData, {inGraphDataFontColor: "#FFF", scaleFontColor: "#FFF"});

                customers = word;
                sale = randomItem(object.words);
                console.log(object.words);
                words = object.words.slice(0);
                cp_corp.executive.push(capitaliseFirstLetter(randomItem(words, true)));
                cp_corp.executive.push(capitaliseFirstLetter(randomItem(words)));

                words = object.words.slice(0);
                finance1 = randomItem(words, true);
                finance2 = randomItem(words, true);
                finance3 = randomItem(words, true);
            }

            // console.log( object, object.affixes );

            var affixes = object.affixes.slice(0);
            name += randomItem(affixes, true);
            competitor1 += randomItem(affixes, true);
            competitor2 += randomItem(affixes, true);
            competitor3 += randomItem(affixes);

            idea = idea.replace( placeholder, word );

            regex.lastIndex = 0;
            item = regex.exec( idea );
        }

        // Update slides
        dom.generate.text( randomItem( responses ));

        dom.elevator_pitch.html(
            '<p><small>Improve your pitching skills! Convince your mates that your startup is the next <strong>' +
            randomItem( cp_corp.next ) + '</strong>. Ready?</small></p>' +
            '<h1>' + name + '</h1>' +
            '<h3>A ' + idea + '</h3>'
        );

        // attributes derived from http://ideonomy.mit.edu/essays/traits.html
        dom.market.html(
            "<p><strong>Global '" + market + ' for ' + customers + "' market size</strong>: $" + Math.round(Math.random()*1000)/100 + 'bn<p><br>' +
            '<h3>Customer base</h3><ul>' +
			    '<li>' + randomItem(cp_corp.attributes, true) + ' '+ customers + '</li>' +
				'<li>' + randomItem(cp_corp.attributes, true) + ' '+ customers + '</li>' +
				'<li>' + randomItem(cp_corp.attributes, true) + ' '+ customers + '</li>' +
			'</ul>' +
            '<p><br><strong>Hype cycle phase</strong>: ' + randomItem(cp_corp.hype_cycle) + '<p>'
        );

        dom.problem.html(
            '<p>' + capitaliseFirstLetter(customers) + ' need ' + market + '.<p>'
        );

        // buzzwords taken from this Quora thread
        dom.product.html(
            '<p>' + name + ' is a <p><ul>' +
			    '<li>' + randomItem(cp_corp.buzzwords, true) + '</li>' +
				'<li>' + randomItem(cp_corp.buzzwords, true) + '</li>' +
				'<li>' + randomItem(cp_corp.buzzwords, true) + '</li>' +
				'<li>' + randomItem(cp_corp.buzzwords, true) + '</li>' +
				'<li>' + randomItem(cp_corp.buzzwords, true) + ' ' + randomItem(cp_corp.product) + '.</li>' +
			'</ul>'
        );

        dom.revenue.html(
            '<h3>Key revenue streams</h3>' +
            '<ul>' +
			    '<li>' + revenue1 + '</li>' +
				'<li>' + revenue2 + '</li>' +
                '<li>' + revenue3 + '</li>' +
        	'</ul>'
        );

        dom.strategy.html(
            '<ol>' +
			    '<li>' + capitaliseFirstLetter(customers) + ' like ' + sale + '.</li>' +
				'<li>Sell ' + market + ' for ' + sale + '.</li>' +
				'<li>...</li>' +
                '<li>Make ' + market + ' ' + randomItem(cp_corp.buzzwords, true) + '.</li>' +
				'<li>...</li>' +
				'<li>Earn money.</li>' +
			'</ol>'
        );

        // first and last names taken from http://fivethirtyeight.com/features/whats-the-most-common-name-in-america/
        dom.team.html(
            '<p>CEO: ' + randomItem(cp_corp.first_names, true) + ' "<i>' + randomItem(cp_corp.nicknames, true) + '</i>" ' + randomItem(cp_corp.surnames, true) + ", " + randomItem(cp_corp.lang, true) + ' ' + randomItem(cp_corp.titles, true) + '<br>' +
            'Chief ' + randomItem(cp_corp.executive, true) + ' Officer: ' + randomItem(cp_corp.first_names, true) + ' "<i>' + randomItem(cp_corp.nicknames, true) + '</i>" ' + randomItem(cp_corp.surnames, true) + ", " + randomItem(cp_corp.lang, true) + ' ' + randomItem(cp_corp.titles, true) + '<br>' +
            'Chief ' + randomItem(cp_corp.executive, true) + ' Officer: ' + randomItem(cp_corp.first_names, true) + ' "<i>' + randomItem(cp_corp.nicknames, true) + '</i>" ' + randomItem(cp_corp.surnames, true) + ", " + randomItem(cp_corp.lang) + ' ' + randomItem(cp_corp.titles, true) + '<br>' +
            'Advisor: ' + randomItem(cp_corp.celebrity) + '<p>'
        );

        dom.financials.html(
            '<ul>' +
			    '<li>Living costs: $' +  Math.round(Math.random()*20000) + '</li>' +
				'<li>Server costs: $' +  Math.round(Math.random()*20000) + '</li>' +
                '<li>Marketing costs: $' +  Math.round(Math.random()*20000) + '</li>' +
                '<li>' + capitaliseFirstLetter(finance1) + ': $' +  Math.round(Math.random()*20000) + '</li>' +
                '<li>' + capitaliseFirstLetter(finance2) + ': $' +  Math.round(Math.random()*20000) + '</li>' +
        	    '<li>' + capitaliseFirstLetter(finance3) + ': $' +  Math.round(Math.random()*20000) + '</li>' +
        	'</ul>'
        );

        dom.competition.html(
            '<p>' + competitor1 + '<br>' + competitor2 + '<br>' + competitor3 + '<p>'
        );

        dom.investment.html(
            '<p>We ask for $' + Math.round(Math.random()*1000) + 'k at a $' + Math.round(Math.random()*10000)/100 + 'm valuation.<p>'
        );
    }

    String.prototype.endsWith = function(suffix) {

        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };

    function capitaliseFirstLetter(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
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
        if ( remove ) {
            list.splice( index, 1 );
        }
        return item;
    }

    function cloneCorpus() {

        var copy = {};

        for ( var key in corpus )

            copy[ key ] = corpus[ key ].concat();
        
        return copy;
    }

    function drawCharts() {

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
