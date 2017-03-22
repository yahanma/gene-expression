// Copyright 2015, University of Colorado Boulder
/**
 * Motion strategy that has no motion, i.e. causes the user to be still.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MotionStrategy = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/motion-strategies/MotionStrategy' );

  /**
   * @constructor
   */
  function StillnessMotionStrategy() {
    MotionStrategy.call( this );
  }

  geneExpressionEssentials.register( 'StillnessMotionStrategy', StillnessMotionStrategy );

  return inherit( MotionStrategy, StillnessMotionStrategy, {


    /**
     * @Override
     * @param {Vector2} currentLocation
     * @param {Bounds2} bounds
     * @param {number} dt
     * @returns {Vector2}
     */
    getNextLocation: function( currentLocation, bounds, dt ) {
      return currentLocation;
    }

  } );

} );