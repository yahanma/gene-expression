// Copyright 2015, University of Colorado Boulder
/**
 * This "map" utility supports HashMap like  functionality by allowing any object to be used as key. Equality is by
 * reference not by value
 * This class copied from sugar-and-salt-solutions //TODO
 *
 * @author Sharfudeen Ashraf
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @returns {{put: put, get: get, contains: contains, keySet: keySet}}
   * @constructor
   */
  function Map() {
    //@private
    this.keys = [];
    //@private
    this.values = [];
  }

  geneExpressionEssentials.register( 'Map', Map );

  return inherit( Object, Map, {
    put: function( key, value ) {
      var index = this.keys.indexOf( key );
      if ( index === -1 ) {
        this.keys.push( key );
        this.values.push( value );
      }
      else {
        this.values[ index ] = value;
      }
    },

    get: function( key ) {
      return this.values[ this.keys.indexOf( key ) ];
    },

    contains: function( key ) {
      return this.keys.indexOf( key ) !== -1;
    },

    remove: function( key ) {
      var index = this.keys.indexOf( key );
      this.values.splice( index, 1 );
      this.keys.splice( index, 1 );
    },

    keySet: function() {
      return this.keys;
    },
    equals: function( obj ) {
      return _.isEqual( this, obj );
    },
    clear: function() {
      this.keys = [];
      this.values = [];
    },

    isEmpty: function() {
      if ( this.keys.length === 0 && this.values.length === 0 ){
        return true;
      }
      return false;
    }
  } );

} );