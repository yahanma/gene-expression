//  Copyright 2002-2014, University of Colorado Boulder
/**
 * Base class for individual attachment states, used by the various attachment
 * state machines.
 *
 * @author John Blanco
 * @author Mohamed Safi
 *
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var GenericUnattachedAndAvailableState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericUnattachedAndAvailableState' );
  var GenericAttachedState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericAttachedState' );
  var GenericMovingTowardsAttachmentState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericMovingTowardsAttachmentState' );
  var GenericUnattachedButUnavailableState = require( 'GENE_EXPRESSION_BASICS/common/model/attachmentstatemachines/GenericUnattachedButUnavailableState' );

  /**
   * @abstract class
   * @constructor
   */
  function AttachmentState() {

  }

  return inherit( Object, AttachmentState, {

    /**
     * @param {AttachmentStateMachine} enclosingStateMachine
     * @param {number} dt
     */
    stepInTime: function( enclosingStateMachine, dt ) {
      // By default does nothing, override to implement unique behavior.
    },

    /**
     * @param {AttachmentStateMachine} enclosingStateMachine
     */
    entered: function( enclosingStateMachine ) {
      // By default does nothing, override to implement unique behavior.
    }

  }, {

    // Distance within which a molecule is considered to be attached to an
    // attachment site.  This essentially avoids floating point issues.
    ATTACHED_DISTANCE_THRESHOLD: 1, // In picometers.

    //staic  methods

    /**
     * @returns {GenericUnattachedAndAvailableState}
     */
    GenericUnattachedAndAvailableState: function() {
      return new GenericUnattachedAndAvailableState();
    },

    /**
     * @returns {GenericAttachedState}
     */
    GenericAttachedState: function() {
      return new GenericAttachedState();
    },

    /**
     * @returns {GenericMovingTowardsAttachmentState}
     */
    GenericMovingTowardsAttachmentState: function() {
      return new GenericMovingTowardsAttachmentState();
    },

    /**
     * @returns {GenericUnattachedButUnavailableState}
     */
    GenericUnattachedButUnavailableState: function() {
      return new GenericUnattachedButUnavailableState();
    }

  } );


} );