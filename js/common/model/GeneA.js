//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Specific instance of a gene.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Gene = require( 'GENE_EXPRESSION_BASICS/common/model/Gene' );
  var IntegerRange = require( 'GENE_EXPRESSION_BASICS/common/util/IntegerRange' );
  var TranscriptionFactor = require( 'GENE_EXPRESSION_BASICS/common/model/TranscriptionFactor' );
  var ProteinA = require( 'GENE_EXPRESSION_BASICS/manualgeneexpression/model/ProteinA' );

  // constants
  var REGULATORY_REGION_COLOR = new Color( 216, 191, 216 );
  var TRANSCRIBED_REGION_COLOR = new Color( 255, 165, 79, 150 );
  var NUM_BASE_PAIRS_IN_REGULATORY_REGION = 16;
  var NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION = 100;

  /**
   * Constructor.
   *
   * @param {DnaMolecule} dnaMolecule     The DNA molecule within which this gene
   *                        exists.
   * @param {number} initialBasePair Location on the DNA strand where this gene
   *                        starts.
   * @constructor
   */
  function GeneA( dnaMolecule, initialBasePair ) {
    Gene.call( this, dnaMolecule,
      new IntegerRange( initialBasePair, initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION ),
      REGULATORY_REGION_COLOR,
      new IntegerRange( initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1,
        initialBasePair + NUM_BASE_PAIRS_IN_REGULATORY_REGION + 1 + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION ),
      TRANSCRIBED_REGION_COLOR
    );

    // Add transcription factors that are specific to this gene.  Location
    // is withing the regulatory region, and the negative factor should
    // overlap, and thus block, the positive factor(s).
    this.addTranscriptionFactor( 5, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_POS );
    this.addTranscriptionFactor( 2, TranscriptionFactor.TRANSCRIPTION_FACTOR_CONFIG_GENE_1_NEG );

  }

  return inherit( Gene, GeneA, {

      /**
       * @Override
       * @returns {ProteinA}
       */
      getProteinPrototype: function() {
        return new ProteinA();
      }

    },

    {

      NUM_BASE_PAIRS: NUM_BASE_PAIRS_IN_REGULATORY_REGION + NUM_BASE_PAIRS_IN_TRANSCRIBED_REGION

    } );

} );