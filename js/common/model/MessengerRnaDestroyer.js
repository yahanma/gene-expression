// Copyright 2015, University of Colorado Boulder
/**
 * Class that represents the small ribosomal subunit in the model.
 *
 * @author John Blanco
 * @author Mohamed Safi
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Color = require( 'SCENERY/util/Color' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var MobileBiomolecule = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/MobileBiomolecule' );
  var RnaDestroyerAttachmentStateMachine = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachment-state-machines/RnaDestroyerAttachmentStateMachine' );

  // constants
  var WIDTH = 250;   // In nanometers.


  /**  static
   * @return {Shape}
   */
  function createShape() {
    var mouthShape = new Shape().moveTo( 0, 0 ).
      arc( 0, 0, WIDTH / 2, Math.PI / 6, 2 * Math.PI - Math.PI /6 ).
      close();
    return mouthShape;
  }

  /**
   *
   * @param {GeneExpressionModel} model
   * @param {Vector2} position
   * @constructor
   */
  function MessengerRnaDestroyer( model, position ) {
    position = position || new Vector2( 0, 0 );
    MobileBiomolecule.call( this, model, createShape(), new Color( 255, 150, 66 ) );
    this.setPosition( position );

    // Reference to the messenger RNA being destroyed.
    this.messengerRnaBeingDestroyed = null;
  }

  geneExpressionEssentials.register( 'MessengerRnaDestroyer', MessengerRnaDestroyer );

  return inherit( MobileBiomolecule, MessengerRnaDestroyer, {

    /**
     * @Override
     * @returns {RnaDestroyerAttachmentStateMachine}
     */
    createAttachmentStateMachine: function() {
      return new RnaDestroyerAttachmentStateMachine( this );
    },

    /**
     *
     * @param {number} amountToDestroy
     * @returns {boolean}
     */
    advanceMessengerRnaDestruction: function( amountToDestroy ) {
      return this.messengerRnaBeingDestroyed.advanceDestruction( amountToDestroy );
    },

    /**
     * Scan for mRNA and propose attachments to any that are found. It is up to the mRNA to accept or refuse based on
     * distance, availability, or whatever.
     *
     * This method is called by the attachment state machine framework.
     *
     * @Override
     * @return {AttachmentSite}
     */
    proposeAttachments: function() {
      var attachmentSite = null;
      var messengerRnaList = this.model.getMessengerRnaList();
      for ( var i = 0; i < messengerRnaList.length; i++ ) {
        var messengerRna = messengerRnaList.get( i );
        attachmentSite = messengerRna.considerProposalFromByMessengerRnaDestroyer( this );
        if ( attachmentSite !== null ) {
          // Proposal accepted.
          this.messengerRnaBeingDestroyed = messengerRna;
          break;
        }
      }
      return attachmentSite;
    },

    /**
     *
     * @returns {number}
     */
    getDestructionChannelLength: function() {

      // Since this looks like a circle with a slice out of it, the channel is half of the width.
      return this.bounds.getWidth() / 2;
    },

    initiateMessengerRnaDestruction: function() {
      this.messengerRnaBeingDestroyed.initiateDestruction( this );
    },

    /**
     *
     * @returns {MessengerRna}
     */
    getMessengerRnaBeingDestroyed: function() {
      return this.messengerRnaBeingDestroyed;
    },

    clearMessengerRnaBeingDestroyed: function() {
      this.messengerRnaBeingDestroyed = null;
    }

  } );

} );
