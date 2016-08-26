// Copyright 2015, University of Colorado Boulder
/**
 /**
 *  Use generic state except that interaction is turned off.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AttachmentState = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/attachmentstatemachines/AttachmentState' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );

  /**
   *
   * @constructor
   * @param  {RnaDestroyerAttachmentStateMachine} rnaDestroyerAttachmentStateMachine
   */
  function MRnaDestroyerMovingTowardAttachmentState( rnaDestroyerAttachmentStateMachine ) {
    AttachmentState.call( this );
    this.rnaDestroyerAttachmentStateMachine = rnaDestroyerAttachmentStateMachine;
  }

  geneExpressionEssentials.register( 'MRnaDestroyerMovingTowardAttachmentState', MRnaDestroyerMovingTowardAttachmentState );

  return inherit( AttachmentState, MRnaDestroyerMovingTowardAttachmentState, {

    /**
     * @Override
     * @param {AttachmentStateMachine} asm
     */
    entered: function( asm ) {
      AttachmentState.prototype.entered.call( this );
      asm.biomolecule.movableByUser = false;
    }

  } );

} );