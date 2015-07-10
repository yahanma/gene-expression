//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Node that, when clicked on, will add a transcription factor to the active area.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var ModelViewTransform2 = require( 'PHETCOMMON/view/ModelViewTransform2' );
  var BiomoleculeCreatorNode = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/view/BiomoleculeCreatorNode' );
  var StubGeneExpressionModel = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/StubGeneExpressionModel' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_BASICS/common/model/TranscriptionFactor' );
  var MobileBiomoleculeNode = require( 'GENE_EXPRESSION_BASICS/common/view/MobileBiomoleculeNode' );


  // constants
  // Scaling factor for this node when used as a creator node.  May be
  // significantly different from the size of the corresponding element
  // in the model.
  var SCALING_FACTOR = 0.07;
  var SCALING_MVT = ModelViewTransform2.createSinglePointScaleInvertedYMapping( new Vector2( 0, 0 ),
    new Vector2( 0, 0 ), SCALING_FACTOR );

  /**
   *
   * @param {BiomoleculeToolBoxNode} biomoleculeBoxNode
   * @param {TranscriptionFactorConfig} tfConfig
   * @constructor
   */
  function TranscriptionFactorCreatorNode( biomoleculeBoxNode, tfConfig ) {
    var thisNode = this;
    BiomoleculeCreatorNode.call( thisNode, new MobileBiomoleculeNode( SCALING_MVT,
        new TranscriptionFactor( new StubGeneExpressionModel(), tfConfig, new Vector2( 0, 0 ) ) ),
      biomoleculeBoxNode.canvas,
      biomoleculeBoxNode.mvt,
      function( pos ) {
        var transcriptionFactor = new TranscriptionFactor( biomoleculeBoxNode.model, tfConfig, pos );
        biomoleculeBoxNode.model.addMobileBiomolecule( transcriptionFactor );
        return transcriptionFactor;

      },
      function( mobileBiomolecule ) {
        biomoleculeBoxNode.model.removeMobileBiomolecule( mobileBiomolecule );

      },
      biomoleculeBoxNode
    );

  }

  return inherit( BiomoleculeCreatorNode, TranscriptionFactorCreatorNode );

} )
;