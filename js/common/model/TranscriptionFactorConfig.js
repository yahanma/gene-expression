//  Copyright 2002-2014, University of Colorado Boulder
/**
 *Class the defines the shape, color, polarity, etc. of a transcription factor.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   *
   * @param {Shape} shape
   * @param {Vector2} positive
   * @param {Color} baseColor
   * @constructor
   */
  function TranscriptionFactorConfig( shape, positive, baseColor ) {
    this.shape = shape;
    this.baseColor = baseColor;
    this.isPositive = positive;


  }

  return inherit( Object, TranscriptionFactorConfig, {} );


} );