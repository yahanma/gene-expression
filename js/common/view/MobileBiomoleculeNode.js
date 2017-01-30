// Copyright 2015, University of Colorado Boulder

/**
 * Base class for displaying and interacting with mobile biomolecules. In essence, this observes the shape of the
 * biomolecule, which changes as it moves.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Color = require( 'SCENERY/util/Color' );
  var GradientUtil = require( 'GENE_EXPRESSION_ESSENTIALS/common/util/GradientUtil' );
  var RnaPolymerase = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/RnaPolymerase' );
  var BiomoleculeDragHandler = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/BiomoleculeDragHandler' );
  var MessengerRna = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MessengerRna' );


  /**
   *
   * @param {ModelViewTransform2} mvt
   * @param {MobileBioMolecule} mobileBiomolecule
   * @param {number} outlineStroke
   * @constructor
   */
  function MobileBiomoleculeNode( mvt, mobileBiomolecule, outlineStroke ) {
    var self = this;
    Node.call( self, { cursor: 'pointer' } );
    outlineStroke = outlineStroke || 1;

    var path = this.getPathByMobileBioMoleculeType( mobileBiomolecule, {
      stroke: Color.BLACK,
      lineWidth: outlineStroke
    } );

    self.addChild( path );

    // Update the shape whenever it changes.
    mobileBiomolecule.addShapeChangeObserver( function( shape ) {
      // Create a shape that excludes any offset.
      var centeredShape = mobileBiomolecule.centeredShape( shape, mvt );
      path.setShape( centeredShape );
      // Account for the offset.
      var offset = mvt.modelToViewPosition( mobileBiomolecule.getPosition() );

      path.x = offset.x;
      path.y = offset.y;

      // For shapes with just one point, the Java Version of GeneralPath's "Bounds" returns a width of
      // zero and height of 1 but kite's shape bounds returns infinity in such cases. Since the MessengerRna starts with
      // a single point, the Gradient fill code fails as the bounds of the shape at that point is infinity.
      // So the following check is added before calling createGradientPaint - Ashraf

      // Set the gradient paint.
      if ( _.isFinite( centeredShape.bounds.centerX ) ) {
        path.fill = GradientUtil.createGradientPaint( centeredShape, mobileBiomolecule.colorProperty.get() );
      }

    } );

    //Update the color whenever it changes.
    mobileBiomolecule.colorProperty.link( function( color ) {
      var moleculeShape = mobileBiomolecule.centeredShape( mobileBiomolecule.getShape(), mvt );

      //see the comment above on gradientPaint
      if ( _.isFinite( moleculeShape.bounds.centerX ) ) {
        path.fill = GradientUtil.createGradientPaint( moleculeShape, color );
      }

    } );

    // Update its existence strength (i.e. fade level) whenever it changes.
    mobileBiomolecule.existenceStrengthProperty.link( function( existenceStrength ) {
      assert && assert( existenceStrength >= 0 && existenceStrength <= 1 ); // Bounds checking.
      path.opacity = Math.min( Number( existenceStrength ), 1 + mobileBiomolecule.zPositionProperty.get() );

    } );

    // Update the "closeness" whenever it changes.
    mobileBiomolecule.zPositionProperty.link( function( zPosition ) {
      assert && assert( zPosition >= -1 && zPosition <= 0 ); // Parameter checking.
      // The further back the biomolecule is, the more
      // transparent it is in order to make it look more distant.
      path.opacity = Math.min( 1 + zPosition, mobileBiomolecule.existenceStrengthProperty.get() );

      // Also, as it goes further back, this node is scaled down
      // a bit, also to make it look further away.
      path.setScaleMagnitude( 1 );
      path.setScaleMagnitude( 1 + 0.15 * zPosition );
    } );

    // If a polymerase molecule attaches to the DNA strand, move it to
    // the back of its current layer so that nothing can go between it
    // and the DNA molecule.  Otherwise odd-looking things can happen.
    mobileBiomolecule.attachedToDnaProperty.link( function( attachedToDna ) {
      if ( mobileBiomolecule instanceof RnaPolymerase && attachedToDna ) {
        path.moveToBack();
      }


    } );

    // Drag handling.
    self.addInputListener( new BiomoleculeDragHandler( mobileBiomolecule, self, mvt ) );


    // Interactivity control.
    mobileBiomolecule.movableByUserProperty.link( function( movableByUser ) {
      path.setPickable( movableByUser );
    } );

    // Move this biomolecule to the top of its layer when grabbed.
    mobileBiomolecule.userControlledProperty.link( function( userControlled ) {
      path.moveToFront();
    } );


  }

  geneExpressionEssentials.register( 'MobileBiomoleculeNode', MobileBiomoleculeNode );

  return inherit( Node, MobileBiomoleculeNode, {

    /**
     *
     * @param {MobileBioMolecule} mobileBiomolecule
     * @param {Object} options
     */
    getPathByMobileBioMoleculeType: function( mobileBiomolecule, options ) {

      // override the computeShapeBounds based on Molecule  to optimize performance - Ashraf TODO verify
      var path = new Path( new Shape(), options );
      if ( mobileBiomolecule instanceof  MessengerRna ) {
        var emptyBounds = new Bounds2( 0, 0, 0, 0 );
        var emptyComputeShapeBounds = function() { return emptyBounds; };
        path.computeShapeBounds = emptyComputeShapeBounds;
      }
      else {
        path.boundsMethod = 'unstroked';
      }

      return path;
    },

    /**
     * Get a shape that is positioned such that its center is at point (0, 0).
     *
     * @param {Shape} shape
     * @return {Shape}
     */
    getCenteredShape: function( shape ) {
      var shapeBounds = shape.bounds;
      var xOffset = shapeBounds.getCenterX();
      var yOffset = shapeBounds.getCenterY();
      var transform = Matrix3.translation( -xOffset, -yOffset );
      return shape.transformed( transform );
    }


  } );
} );