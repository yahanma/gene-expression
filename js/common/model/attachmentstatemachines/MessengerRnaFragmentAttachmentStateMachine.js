//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Attachment state machine for messenger RNA fragments.  These fragments
 * start their life as being attached to an mRNA destroyer, and and then
 * released into the cytoplasm to wander and fade.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentStateMachine = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentStateMachine' );
  var AttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/AttachmentStateMachine' );
  var StillnessMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/StillnessMotionStrategy' );
  var RandomWalkMotionStrategy = require( 'GENE_EXPRESSION_BASICS/common/model/motionstrategies/RandomWalkMotionStrategy' );

  // constants
  var FADE_OUT_TIME = 3; // In seconds.


  // private classes
  var AttachedToDestroyerState = inherit( AttachmentState,

    /**
     * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
     */
    function( messengerRnaFragmentAttachmentStateMachine ) {

      this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;

    },

    {

      /**
       * @Override
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        biomolecule.setMotionStrategy( new StillnessMotionStrategy() );
      }

    } );


  var UnattachedAndFadingState = inherit( AttachmentState,

    /**
     * @param {MessengerRnaFragmentAttachmentStateMachine} messengerRnaFragmentAttachmentStateMachine
     */
    function( messengerRnaFragmentAttachmentStateMachine ) {
      this.messengerRnaFragmentAttachmentStateMachine = messengerRnaFragmentAttachmentStateMachine;
    },

    {

      /**
       * @param {AttachmentStateMachine} asm
       */
      entered: function( asm ) {
        var biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        biomolecule.setMotionStrategy( new RandomWalkMotionStrategy( biomolecule.motionBoundsProperty ) );
      },

      /**
       * @param {AttachmentStateMachine} asm
       * @param {number} dt
       */
      stepInTime: function( asm, dt ) {
        var biomolecule = this.messengerRnaFragmentAttachmentStateMachine.biomolecule;
        biomolecule.existenceStrength.set( Math.max( biomolecule.existenceStrength.get() - dt / FADE_OUT_TIME, 0 ) );
      }

    } );


  /**
   * @param biomolecule {MobileBioMolecule}
   * @constructor
   */
  function MessengerRnaFragmentAttachmentStateMachine( biomolecule ) {
    AttachmentStateMachine.call( this, biomolecule );
    this.setState( new AttachedToDestroyerState( this ) );
  }

  return inherit( AttachmentStateMachine, MessengerRnaFragmentAttachmentStateMachine, {

    /**
     * @Override
     */
    detach: function() {
      this.setState( new UnattachedAndFadingState( this ) );
    }

  } );


} );
