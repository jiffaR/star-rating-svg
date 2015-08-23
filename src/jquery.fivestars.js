// fivestars.js
// svg star rating jQuery plugin
// http://github.com/nashio

;(function ( $, window, document, undefined ) {

    'use strict';

    // Create the defaults once
    var pluginName = 'fivestars';
    var defaults = {
        totalStars: 5,
        emptyColor: 'lightgray',
        hoverColor: 'orange',
        activeColor: 'yellow',
        useGradient: true, // TODO:
        // TODO: get rating from data-attribute
        starGradient: {
            start: '#FEF7CD',
            end: '#FF9511'
        },
        strokeWidth: 0,
        initialRating: 0,
        starSize: 50
    };

    // The actual plugin constructor
    var Plugin = function( element, options ) {
        this.element = element;
        this.settings = $.extend( {}, defaults, options );
        this.$el = $(element);

        // create unique id for stars
        this._uid = Math.floor( Math.random() * 999 );

        this._state = {
            rating: this.settings.initialRating
        };
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    };

    var methods = {
        init: function () {
            this.renderStars();
            this.addListeners();
            this.initRating();
        },

        addListeners: function(){
            this.$star.on('mouseover', this.hoverRating.bind(this));
            this.$star.on('mouseout', this.restoreState.bind(this));
            this.$star.on('click', this.applyRating.bind(this));
        },

        hoverRating: function(e){
            this.paintStars(this.getIndex(e), 'hovered');
        },

        applyRating: function(e){
            var index = this.getIndex(e);
            var rating = index + 1;

            // paint selected stars and remove hovered color
            this.paintStars(index, 'active');
            this.executeCallback( rating );
            this._state.rating = rating;
        },

        restoreState: function(){
            var rating = this._state.rating || -1;
            this.paintStars(rating - 1, 'active');
        },

        getIndex: function(e){
            var $target = $(e.currentTarget);
            var side = $(e.target).data('side');
            // get half or whole star
            var index = $target.index() - ((side === 'left') ? 0.5 : 0);
            return index;
        },

        initRating: function(){
            this.paintStars(this.settings.initialRating - 1, 'active');
        },

        paintStars: function(endIndex, stateClass){
            var $polygonLeft;
            var $polygonRight;
            var newClass;

            $.each(this.$star, function(index, star){
                $polygonLeft = $(star).find('polygon[data-side="left"]');
                $polygonRight = $(star).find('polygon[data-side="right"]');
                newClass = (index <= endIndex) ? stateClass : 'empty';
                $polygonLeft.attr('class', 'svg-'  + newClass + '-' + this._uid);
            }.bind(this));
        },

        renderStars: function () {
            // inject an svg manually to have control over attributes
            var star = '<div class="fs-star" style="width:' + this.settings.starSize+ 'px;  height:' + this.settings.starSize + 'px;"><svg version="1.1" class="fs-star-svg" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="228.6px" height="218px" viewBox="64 -59 228.6 218" style="enable-background:new 64 -59 228.6 218; stroke-width:' + this.settings.strokeWidth + 'px;" xml:space="preserve"><style type="text/css">.svg-empty-' + this._uid + '{fill:url(#' + this._uid + '_SVGID_1_);}.svg-hovered-' + this._uid + '{fill:url(#' + this._uid + '_SVGID_2_);}.svg-active-' + this._uid + '{fill:url(#' + this._uid + '_SVGID_3_);}</style>' +
                this.getLinearGradient(this._uid + '_SVGID_1_', this.settings.emptyColor, this.settings.emptyColor) +
                this.getLinearGradient(this._uid + '_SVGID_2_', this.settings.hoverColor, this.settings.hoverColor) +
                this.getLinearGradient(this._uid + '_SVGID_3_', this.settings.starGradient.start, this.settings.starGradient.end) +
                '<polygon data-side="left" class="svg-empty-' + this._uid + '"  points="146.7,17.6 64,23.9 127.1,77.7 107.5,158.3 178.2,114.9 178.3,-59"/><polygon data-side="right" class="svg-empty-' + this._uid + '" points="292.6,24.1 209.9,17.7 178.3,-59 178.2,114.9 248.8,158.4 229.4,77.8  "/>' +
                '</svg></div>';
// -249.3
            // inject svg markup
            var starsMarkup = '';
            for( var i = 0; i < this.settings.totalStars; i++){
                starsMarkup += star;
            }
            this.$el.append(starsMarkup);
            this.$star = this.$el.find('.fs-star');
        },

        getLinearGradient: function(id, startColor, endColor){
            return '<linearGradient id="' + id + '" gradientUnits="userSpaceOnUse" x1="121.1501" y1="-80.35" x2="121.15" y2="102.0045"><stop  offset="0" style="stop-color:' + startColor + '"/><stop  offset="1" style="stop-color:' + endColor + '"/> </linearGradient>';
        },

        executeCallback: function(rating){
            var callback = this.settings.callback;
            if( $.isFunction( callback ) ){
                callback(rating);
            }
        }

    };


    // Avoid Plugin.prototype conflicts
    $.extend(Plugin.prototype, methods);

    $.fn[ pluginName ] = function ( options ) {
            return this.each(function() {
                // preventing against multiple instantiations
                if ( !$.data( this, 'plugin_' + pluginName ) ) {
                    $.data( this, 'plugin_' + pluginName, new Plugin( this, options ) );
                }
            });
        };

})( jQuery, window, document );


