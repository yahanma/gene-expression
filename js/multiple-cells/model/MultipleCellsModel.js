// Copyright 2015-2020, University of Colorado Boulder

/**
 * Primary model for the Multiple Cells screen.
 *
 * @author John Blanco
 * @author Aadish Gupta
 */

import ObservableArray from '../../../../axon/js/ObservableArray.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Random from '../../../../dot/js/Random.js';
import inherit from '../../../../phet-core/js/inherit.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import Cell from './Cell.js';
import CellProteinSynthesisSimulator from './CellProteinSynthesisSimulator.js';

// constants
const MAX_CELLS = 90;

const boundingShapeWidth = Cell.DefaultCellSize.width * 20;
const boundingShapeHeight = boundingShapeWidth * 0.35;
const bounds = new Bounds2(
  -boundingShapeWidth / 2,
  -boundingShapeHeight / 2,
  -boundingShapeWidth / 2 + boundingShapeWidth,
  -boundingShapeHeight / 2 + boundingShapeHeight
);

// Seeds for the random number generators.  Values chosen empirically.
const POSITION_RANDOMIZER_SEED = 226;
const SIZE_AND_ORIENTATION_RANDOMIZER_SEED = 25214903912;

/**
 * @constructor
 */
function MultipleCellsModel() {
  const self = this;
  this.clockRunningProperty = new Property( true ); // @public

  // List of all cells that are being simulated. Some of these cells will be visible to the user at any given time,
  // but some may not. All are clocked and their parameters are kept the same in order to keep them "in sync" with the
  // visible cells. This prevents large discontinuities in the protein level when the user adds or removes cells.
  this.cellList = []; // @public

  // List of cells in the model that should be visible to the user and that are being used in the average protein
  // level calculation. It is observable so that the view can track them coming and going.
  this.visibleCellList = new ObservableArray(); // @public

  // Property that controls the number of cells that are visible and that are being included in the calculation of the
  // average protein level. This is intended to be set by clients, such as the view.
  this.numberOfVisibleCellsProperty = new Property( 1 ); // @public

  // Properties used to control the rate at which protein is synthesized and degraded in the cells. These are intended
  // to be set by clients, such as the view.
  // @public
  this.transcriptionFactorLevelProperty = new Property( CellProteinSynthesisSimulator.DefaultTranscriptionFactorCount, { reentrant: true } );
  this.proteinDegradationRateProperty = new Property( CellProteinSynthesisSimulator.DefaultProteinDegradationRate );
  this.transcriptionFactorAssociationProbabilityProperty = new Property(
    CellProteinSynthesisSimulator.DefaultTFAssociationProbability, {
      reentrant: true
    }
  );
  this.polymeraseAssociationProbabilityProperty = new Property(
    CellProteinSynthesisSimulator.DefaultPolymeraseAssociationProbability
  );
  this.mRnaDegradationRateProperty = new Property( CellProteinSynthesisSimulator.DefaultMRNADegradationRate, { reentrant: true } );

  // Property that tracks the average protein level of all the cells.
  this.averageProteinLevelProperty = new Property( 0.0 ); // @public( read-only )

  // Random number generators, used to vary the shape and position of the cells. Seeds are chosen empirically.
  // @private
  this.sizeAndRotationRandomizer = new Random( {
    seed: SIZE_AND_ORIENTATION_RANDOMIZER_SEED
  } );
  this.positionRandomizer = new Random( {
    seed: POSITION_RANDOMIZER_SEED
  } );

  // Add the max number of cells to the list of invisible cells.
  while ( this.cellList.length < MAX_CELLS ) {
    var newCell;
    if ( this.cellList.length === 0 ) {
      // The first cell is centered and level.
      newCell = new Cell( 0 );
      newCell.positionX = 0;
      newCell.positionY = 0;
    }
    else {
      newCell = new Cell( Math.PI * 2 * this.sizeAndRotationRandomizer.nextDouble() );
      this.placeCellInOpenPosition( newCell );
    }
    this.cellList.push( newCell );
  }

  // Hook up the property that controls the number of visible cells.
  this.numberOfVisibleCellsProperty.link( function( numVisibleCells ) {
    assert && assert( numVisibleCells >= 1 && numVisibleCells <= MAX_CELLS );
    self.setNumVisibleCells( Math.floor( numVisibleCells ) );
  } );

  // Hook up the cell property parameters to the individual cells so that changes are propagated.
  this.transcriptionFactorLevelProperty.link( function( transcriptionFactorLevel ) {
    self.cellList.forEach( function( cell ) {
      cell.setTranscriptionFactorCount( transcriptionFactorLevel );
    } );
  } );

  this.polymeraseAssociationProbabilityProperty.link( function( polymeraseAssociationProbability ) {
    self.cellList.forEach( function( cell ) {
      cell.setPolymeraseAssociationRate( polymeraseAssociationProbability );
    } );
  } );

  this.transcriptionFactorAssociationProbabilityProperty.link( function( transcriptionFactorAssociationProbability ) {
    self.cellList.forEach( function( cell ) {
      cell.setGeneTranscriptionFactorAssociationRate( transcriptionFactorAssociationProbability );
    } );
  } );

  this.proteinDegradationRateProperty.link( function( proteinDegradationRate ) {
    self.cellList.forEach( function( cell ) {
      cell.setProteinDegradationRate( proteinDegradationRate );
    } );
  } );

  this.mRnaDegradationRateProperty.link( function( mRnaDegradationRate ) {
    self.cellList.forEach( function( cell ) {
      cell.setMRnaDegradationRate( mRnaDegradationRate );
    } );
  } );
}

geneExpressionEssentials.register( 'MultipleCellsModel', MultipleCellsModel );
inherit( Object, MultipleCellsModel, {

  /**
   * @param {number} dt
   * @public
   */
  step: function( dt ) {
    if ( this.clockRunningProperty.get() ) {
      this.stepInTime( dt );
    }
  },

  /**
   * @param {number} dt
   * @public
   */
  stepInTime: function( dt ) {
    // Step each of the cells.
    // Update the average protein level. Note that only the visible cells are used for this calculation. This helps
    // convey the concept that the more cells there are, the more even the average level is.

    const self = this;
    let totalProteinCount = 0;
    this.cellList.forEach( function( cell ) {
      cell.step( dt );
      if ( self.visibleCellList.contains( cell ) ) {
        totalProteinCount += cell.proteinCount.get();
      }
    } );
    this.averageProteinLevelProperty.set( totalProteinCount / this.visibleCellList.length );
  },

  /**
   * @public
   */
  reset: function() {
    // Reset all the cell control parameters.
    this.numberOfVisibleCellsProperty.reset();
    this.transcriptionFactorLevelProperty.reset();
    this.proteinDegradationRateProperty.reset();
    this.transcriptionFactorAssociationProbabilityProperty.reset();
    this.polymeraseAssociationProbabilityProperty.reset();
    this.mRnaDegradationRateProperty.reset();
    this.clockRunningProperty.reset();
    this.setNumVisibleCells( this.numberOfVisibleCellsProperty.get() );

    // Step the model a bunch of times in order to allow it to reach a steady state. The number of times that are
    // needed to reach steady state was empirically determined.
    for ( let i = 0; i < 1000; i++ ) {
      this.step( 0.016 );
    }
  },

  /**
   * Set the number of cells that should be visible to the user and that are included in the calculation of average
   * protein level.
   * @param numCells - target number of cells.
   * @public
   */
  setNumVisibleCells: function( numCells ) {
    assert && assert( numCells > 0 && numCells <= MAX_CELLS );  // Bounds checking.

    if ( this.visibleCellList.length < numCells ) {
      // Add cells to the visible list.
      while ( this.visibleCellList.length < numCells ) {
        this.visibleCellList.add( this.cellList[ this.visibleCellList.length ] );
      }
    }
    else if ( this.visibleCellList.length > numCells ) {
      // Remove cells from the visible list.  Take them off the end.
      while ( this.visibleCellList.length > numCells ) {
        this.visibleCellList.pop();
      }
    }
  },

  /**
   * find a position for the given cell that doesn't overlap with other cells on the list
   * @private
   */
  placeCellInOpenPosition: function( cell ) {

    // Loop, randomly generating positions of increasing distance from the center, until the cell is positioned in a
    // place that does not overlap with the existing cells. The overall bounding shape of the collection of cells is
    // elliptical, not circular.
    for ( let i = 0; i < Math.ceil( Math.sqrt( this.cellList.length ) ); i++ ) {
      const radius = ( i + 1 ) * Cell.DefaultCellSize.width * ( this.positionRandomizer.nextDouble() / 2 + .75 );
      for ( let j = 0; j < radius * Math.PI / ( Cell.DefaultCellSize.height * 2 ); j++ ) {
        const angle = this.positionRandomizer.nextDouble() * 2 * Math.PI;
        cell.positionX = radius * Math.cos( angle );
        cell.positionY = radius * Math.sin( angle );
        if ( !bounds.containsCoordinates( cell.positionX, cell.positionY ) ) {
          // Not in bounds.
          continue;
        }
        let overlapDetected = false;
        for ( let k = 0; k < this.cellList.length; k++ ) {
          const existingCell = this.cellList[ k ];
          // new bounds
          if ( cell.bounds.shifted( cell.positionX, cell.positionY )
            .intersectsBounds( existingCell.bounds.shifted( existingCell.positionX, existingCell.positionY ) ) ) {
            overlapDetected = true;
            break;
          }
        }
        if ( !overlapDetected ) {
          // Found an open spot.
          return;
        }
      }
    }
    assert && assert( false, 'exited placement loop without having found open position' );
  }
}, {

  // statics
  MaxCells: MAX_CELLS
} );

export default MultipleCellsModel;
