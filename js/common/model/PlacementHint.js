// Copyright 2015, University of Colorado Boulder
/**
 * This class represents a "placement hint" in the model, which is a location
 * where a biomolecule of the provided type can be placed and which will be
 * "hinted" to the user at the appropriate times.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  //modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var ShapeChangingModelElement = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeChangingModelElement' );


  /**
   *
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function PlacementHint( biomolecule ) {
    // Biomolecule that defines the shape of this hint.
    this.biomolecule = biomolecule;

    ShapeChangingModelElement.call( this, biomolecule.getShape(), {
      // Property that tracks whether or not the hint is should be visible to the user.
      active: false
    } );
  }

  geneExpressionEssentials.register( 'PlacementHint', PlacementHint );

  return inherit( ShapeChangingModelElement, PlacementHint, {

    /**
     * @returns {Color}
     */

    getBaseColor: function() {
      return this.biomolecule.color;
    },

    /**
     * Determine whether the given biomolecule matches the one that this hint is
     * meant to represent.  In this base class, type alone indicates a match.
     * Subclass if greater specificity is needed.
     *
     * @param {MobileBiomolecule} testBiomolecule
     * @return {boolean}
     */
    isMatchingBiomolecule: function( testBiomolecule ) {
      return testBiomolecule instanceof this.biomolecule.constructor;
    },

    /**
     * If the proffered test biomolecule is of the appropriate type, activate
     * this hint.
     *
     * @param {MobileBiomolecule} testBiomolecule
     */
    activateIfMatch: function( testBiomolecule ) {
      if ( this.isMatchingBiomolecule( testBiomolecule ) ) {
        this.activeProperty.set( true );
      }
    }

  } );


} );
// Copyright 2002-2014, University of Colorado Boulder
//package edu.colorado.phet.geneexpressionbasics.common.model;
//
//import java.awt.Color;
//
//import edu.colorado.phet.common.phetcommon.model.property.BooleanProperty;
//
///**
// * This class represents a "placement hint" in the model, which is a location
// * where a biomolecule of the provided type can be placed and which will be
// * "hinted" to the user at the appropriate times.
// *
// * @author John Blanco
// */
//public class PlacementHint extends ShapeChangingModelElement {
//
//    // Biomolecule that defines the shape of this hint.
//    private final MobileBiomolecule biomolecule;
//
//    // Property that tracks whether or not the hint is should be visible to the
//    // user.
//    public final BooleanProperty active = new BooleanProperty( false );
//
//    /**
//     * Constructor.
//     *
//     * @param biomolecule
//     */
//    public PlacementHint( MobileBiomolecule biomolecule ) {
//        super( biomolecule.getShape() );
//        this.biomolecule = biomolecule;
//    }
//
//    public Color getBaseColor() {
//        return biomolecule.colorProperty.get();
//    }
//
//    /**
//     * Determine whether the given biomolecule matches the one that this hint is
//     * meant to represent.  In this base class, type alone indicates a match.
//     * Subclass if greater specificity is needed.
//     *
//     * @param testBiomolecule
//     * @return
//     */
//    public boolean isMatchingBiomolecule( MobileBiomolecule testBiomolecule ) {
//        return testBiomolecule.getClass() == this.biomolecule.getClass();
//    }
//
//    /**
//     * If the proffered test biomolecule is of the appropriate type, activate
//     * this hint.
//     *
//     * @param testBiomolecule
//     */
//    public void activateIfMatch( MobileBiomolecule testBiomolecule ) {
//        if ( isMatchingBiomolecule( testBiomolecule ) ) {
//            active.set( true );
//        }
//    }
//}
