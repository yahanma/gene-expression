// Copyright 2015-2019, University of Colorado Boulder

/**
 * This class defined the attachment state machine for all ribosomes. Ribosomes pretty much only connect to mRNA, so
 * that's what this controls.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */


// modules
// const MovingTowardMRnaAttachmentState = require( '/gene-expression-essentials/js/common/model/attachment-state-machines/MovingTowardMRnaAttachmentState' );
import inherit from '../../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../../geneExpressionEssentials.js';
import GenericAttachmentStateMachine from './GenericAttachmentStateMachine.js';
import RibosomeAttachedState from './RibosomeAttachedState.js';
import UnattachedAndAvailableForMRnaAttachmentState from './UnattachedAndAvailableForMRnaAttachmentState.js';

/**
 * @param {MobileBiomolecule} biomolecule
 * @constructor
 */
function RibosomeAttachmentStateMachine( biomolecule ) {
  GenericAttachmentStateMachine.call( this, biomolecule );

  // Set up a local reference of the needed type.

  this.ribosome = biomolecule; //@public

  // Protein created during translation process, null if no protein is being synthesized.
  this.proteinBeingSynthesized = null; //@public

  // Set up offset used when attaching to mRNA.
  this.setDestinationOffset( this.ribosome.offsetToTranslationChannelEntrance );

  // @override - override the unattached state, since attaching to mRNA is a little different versus the default behavior
  this.unattachedAndAvailableState = new UnattachedAndAvailableForMRnaAttachmentState( this );

  // @override - Set up a non-default "attached" state, since the behavior is different from the default.
  this.attachedState = new RibosomeAttachedState( this ); //@public
}

geneExpressionEssentials.register( 'RibosomeAttachmentStateMachine', RibosomeAttachmentStateMachine );

export default inherit( GenericAttachmentStateMachine, RibosomeAttachmentStateMachine, {

  /**
   * @override
   * @public
   */
  forceImmediateUnattachedAndAvailable: function() {
    if ( this.ribosome.getMessengerRnaBeingTranslated() !== null ) {
      this.ribosome.releaseMessengerRna();
    }
    GenericAttachmentStateMachine.prototype.forceImmediateUnattachedAndAvailable.call( this );
  },

  /**
   * detach is a little different for a ribosome, since it will likely have moved away from its original attachment
   * point on the mRNA
   * @override
   * @public
   */
  detach: function() {
    if ( this.attachmentSite ) {
      this.attachmentSite.attachedOrAttachingMoleculeProperty.set( null );
      this.attachmentSite = null;
    }
    this.forceImmediateUnattachedButUnavailable();
  },

  /**
   * returns true if the state indicates that the ribosome is currently translating mRNA, false otherwise
   * @returns {boolean}
   * @public
   */
  isTranslating: function() {
    return ( this.attachmentState === this.attachedState );
  }
} );