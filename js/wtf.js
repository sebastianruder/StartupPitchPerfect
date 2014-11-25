
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

    // data for traction chart
    var randomScalingFactor = function(){ return Math.round(Math.random()*500000)};
    var tractionChartData = {
        labels : ["May","June","July","August","September","October","November"],
        datasets : [
            {
                label: "My First dataset",
                labels: ["one", "two", "three", "four", "five", "six", "seven"],
                fillColor : "rgba(220,220,220,0.2)",
                strokeColor : "rgba(220,220,220,1)",
                pointColor : "rgba(220,220,220,1)",
                pointStrokeColor : "#fff",
                pointHighlightFill : "#fff",
                pointHighlightStroke : "rgba(220,220,220,1)",
                data : [randomScalingFactor()*0.3,randomScalingFactor()*0.5,randomScalingFactor()*0.8,randomScalingFactor()*1.2,randomScalingFactor()*1.5,randomScalingFactor()*1.8,randomScalingFactor()*2]
            }
        ]
    }

    // data for problem chart
    var problemChartData = [{
        value : randomScalingFactor()*2,
        color: "#D97041",
        title : "would sell their left kidney for it"
    },
    {
        value : randomScalingFactor()*1.5,
        color: "#C7604C",
        title : "need it a lot"
    },
    {
        value : randomScalingFactor(),
        color: "#21323D",
        title : "would maybe buy it"
    },
    {
        value : randomScalingFactor(),
        color: "#9D9B7F",
        title : "are indifferent"
    }
    /*
    {
        value : 82,
        color: "#7D4F6D",
      title : "data5"
    },
    {
        value : 8,
        color: "#584A5E",
      title : "data6"
    }
    */
    ];

    // line and bar chart coloring context (color change to white)
    var lineBarChartContext = {
        responsive: true,
        // inGraphDataShow : true,
        inGraphDataFontColor: "#FFF",
        scaleFontColor: "#FFF"
    };

    // problem chart context
    var problemChartContext = {/*
        inGraphDataShow: true,
        inGraphDataFontColor: "#FFF",
        inGraphDataFontSize: 15,
        // radiusScale: 1.3,
        inGraphDataAlign: "to-center",
        inGraphDataVAlign: "to-center",
        inGraphDataRotate: "inRadiusAxisRotateLabels", // "inRadiusAxisRotateLabels"
        */
        legend: true,
        legendFontSize: 20,
        legendFontStyle: "normal",
        legendFontColor: "#FFF",
        legendBlockSize: 15,
        legendBorders: false,
        legendBordersWidth: 1
    };

    // revenue chart data
    var revenueChartData = {
        labels : ["January","February","March"],
        datasets : [
            {
                fillColor : "rgba(220,220,220,0.5)",
                strokeColor : "rgba(220,220,220,0.8)",
                highlightFill: "rgba(220,220,220,0.75)",
                highlightStroke: "rgba(220,220,220,1)",
                data : [randomScalingFactor()*2,randomScalingFactor()*2,randomScalingFactor()*2]
            }
        ]
    }

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
            copied_corpus = cloneCorpus(),
            object, customers, sale, name = "", competitor1 = "", competitor2 = "", competitor3 = "";

        // draw traction and problem chart; revenue chart is drawn later
        var traction_chart = document.getElementById("traction_chart").getContext("2d");
        window.traction = new Chart(traction_chart).Line(tractionChartData, lineBarChartContext);
        var problem_chart = document.getElementById("problem_chart").getContext("2d");
        window.problem = new Chart(problem_chart).Pie(problemChartData, problemChartContext);

        while ( item && ++iter < 1000 ) {

            placeholder = item[ 0 ]; // has form "@X"
            key = item[ 1 ]; // has form "X"

            // object is an object with attribute "name", etc.
            object = randomItem(copied_corpus[ key ], true);
            word = object.name;

            // only "X" has market attribute
            if (key === "X") {
                market = object.market;

                // add killer as product name pitch
                copied_corpus.product.push(word + "-killer");
                console.log( copied_corpus.product);
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
                revenueChartData.labels = [randomItem(words, true), randomItem(words, true), randomItem(words)];
                var revenue_chart = new Chart(document.getElementById("revenue_chart").getContext("2d")).Bar(
                    revenueChartData, lineBarChartContext);

                customers = word;
                sale = randomItem(object.words);
                console.log(object.words);
                copied_corpus.executive.push(capitaliseFirstLetter(randomItem(object.words, true)));
                copied_corpus.executive.push(capitaliseFirstLetter(randomItem(object.words)));
            }

            // console.log( object, object.affixes );

            name += randomItem(object.affixes);
            competitor1 += randomItem(object.affixes);
            competitor2 += randomItem(object.affixes);
            competitor3 += randomItem(object.affixes);

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

        // attributes derived from http://ideonomy.mit.edu/essays/traits.html
        dom.market.html(
            "<p><strong>Global '" + market + ' for ' + customers + "' market size</strong>: $" + Math.round(Math.random()*1000)/100 + 'bn<p><br>' +
            '<h3>Customer base</h3><ul>' +
			    '<li>' + randomItem(copied_corpus.attributes, true) + ' '+ customers + '</li>' +
				'<li>' + randomItem(copied_corpus.attributes, true) + ' '+ customers + '</li>' +
				'<li>' + randomItem(copied_corpus.attributes, true) + ' '+ customers + '</li>' +
			'</ul>' +
            '<p><br><strong>Hype cycle phase</strong>: ' + randomItem(copied_corpus.hype_cycle) + '<p>'
        );

        dom.problem.html(
            '<p>' + capitaliseFirstLetter(customers) + ' need ' + market + '.<p>'
        );

        // buzzwords taken from this Quora thread
        dom.product.html(
            '<p>' + name + ' is a <p><ul>' +
			    '<li>' + randomItem(copied_corpus.buzzwords, true) + '</li>' +
				'<li>' + randomItem(copied_corpus.buzzwords, true) + '</li>' +
				'<li>' + randomItem(copied_corpus.buzzwords, true) + '</li>' +
				'<li>' + randomItem(copied_corpus.buzzwords, true) + '</li>' +
				'<li>' + randomItem(copied_corpus.buzzwords, true) + ' ' + randomItem(copied_corpus.product) + '.</li>' +
			'</ul>'
        );

        dom.strategy.html(
            '<p><ol>' +
			    '<li>' + capitaliseFirstLetter(customers) + ' like ' + sale + '.</li>' +
				'<li>Sell ' + market + ' for ' + sale + '.</li>' +
				'<li>...</li>' +
                '<li>Make ' + market + ' ' + randomItem(copied_corpus.buzzwords, true) + '.</li>' +
				'<li>...</li>' +
				'<li>Earn money.</li>' +
			'</ol>'
        );

        dom.team.html(
            '<p>CEO: <br>' +
            'Chief ' + randomItem(copied_corpus.executive, true) + ' Officer: <br>' +
            'Chief ' + randomItem(copied_corpus.executive, true) + ' Officer: <p>'
        );

        dom.competition.html(
            '<p>' + competitor1 + '<br>' + competitor2 + '<br>' + competitor3 + '<p>'
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
