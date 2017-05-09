// Copyright 2015, University of Colorado Boulder

/**
 * Attachment state machine for all transcription factor molecules. This class controls how transcription factors behave
 * with respect to attaching to and detaching from the DNA molecule, which is the only thing to which the transcription
 * factors attach.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var GenericAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/GenericAttachmentStateMachine' );
  var inherit = require( 'PHET_CORE/inherit' );
  var TranscriptionFactorAttachedState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/TranscriptionFactorAttachedState' );

  /**
   * @param {MobileBiomolecule} biomolecule
   * @constructor
   */
  function TranscriptionFactorAttachmentStateMachine( biomolecule ) {
    GenericAttachmentStateMachine.call( this, biomolecule );

    // Set up a new "attached" state, since the behavior is different from  the default.
    this.attachedState = new TranscriptionFactorAttachedState( this ); //@public

    // Threshold for the detachment algorithm, used in deciding whether or not to detach completely from the DNA at a
    // given time step.
    this.detachFromDnaThreshold = 1; //@public
  }

  geneExpressionEssentials.register( 'TranscriptionFactorAttachmentStateMachine', TranscriptionFactorAttachmentStateMachine );

  return inherit( GenericAttachmentStateMachine, TranscriptionFactorAttachmentStateMachine, {} );
} );
