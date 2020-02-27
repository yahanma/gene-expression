// Copyright 2017-2019, University of Colorado Boulder

/**
 * A DNA Backbone Layer rendered on canvas. This exists for performance reasons.
 *
 * @author Aadish Gupta
 */

import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import inherit from '../../../../phet-core/js/inherit.js';
import CanvasNode from '../../../../scenery/js/nodes/CanvasNode.js';
import Color from '../../../../scenery/js/util/Color.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import ShapeUtils from '../model/ShapeUtils.js';

// constants
const STRAND_1_COLOR = new Color( 31, 163, 223 );
const STRAND_2_COLOR = new Color( 214, 87, 107 );
const BASE_PAIR_COLOR = Color.DARK_GRAY.computeCSS();

/**
 * @param {DnaMolecule} model
 * @param {ModelViewTransform2} modelViewTransform
 * @param {number} backboneStrokeWidth
 * @param {Object} [options]
 * @constructor
 */
function DnaMoleculeCanvasNode( model, modelViewTransform, backboneStrokeWidth, options ) {
  this.model = model; // @private
  this.modelViewTransform = modelViewTransform; // @private
  this.backboneStrokeWidth = modelViewTransform.viewToModelDeltaX( backboneStrokeWidth ); // @private

  // @private - pre-allocated reusable vectors, used to reduce garbage collection
  this.cp1ResuableVector = new Vector2( 0, 0 );
  this.cp2ResuableVector = new Vector2( 0, 0 );

  // @private - four arrays for the DNA backbone representation
  const longerArrayLength = Utils.roundSymmetric( this.model.strand1Segments.length / 2 );
  const shorterArrayLength = Math.floor( this.model.strand1Segments.length / 2 );
  this.strand1ArrayBehind = new Array( shorterArrayLength );
  this.strand2ArrayBehind = new Array( longerArrayLength );
  this.strand1ArrayFront = new Array( longerArrayLength );
  this.strand2ArrayFront = new Array( shorterArrayLength );

  CanvasNode.call( this, options );
  this.invalidatePaint();
}

geneExpressionEssentials.register( 'DnaMoleculeCanvasNode', DnaMoleculeCanvasNode );

export default inherit( CanvasNode, DnaMoleculeCanvasNode, {

  /**
   * Draws the base pairs - this normally just draws a single line the connects between the two strands, but if the
   * strands are split it draws the base pairs in two pieces.
   * @param {CanvasRenderingContext2D} context
   * @param {BasePair}basePair
   * @private
   */
  drawBasePair: function( context, basePair ) {

    const endOffset = basePair.width / 2;

    if ( basePair.topYLocation - basePair.bottomYLocation <= this.model.maxBasePairHeight ) {

      // draw the base pair as a single line between the top and bottom locations
      context.moveTo( basePair.x, basePair.topYLocation + endOffset );
      context.lineTo( basePair.x, basePair.bottomYLocation - endOffset );
    }
    else {

      // the strands are separated, draw two separate base pairs, one at the top and one at the bottom
      const dividedBasePairHeight = this.model.maxBasePairHeight / 2;
      context.moveTo( basePair.x, basePair.topYLocation + endOffset );
      context.lineTo( basePair.x, basePair.topYLocation - dividedBasePairHeight );
      context.moveTo( basePair.x, basePair.bottomYLocation - endOffset );
      context.lineTo( basePair.x, basePair.bottomYLocation + dividedBasePairHeight );
    }

    context.lineWidth = basePair.width;
  },

  /**
   * Draws the strand segments
   * @param {CanvasRenderingContext2D} context
   * @param {Array} strandSegmentArray
   * @param {Color} strokeColor
   * @private
   */
  drawStrandSegments: function( context, strandSegmentArray, strokeColor ) {
    context.beginPath();

    // allocate reusable vectors for optimal performance
    let cp1 = this.cp1ResuableVector;
    let cp2 = this.cp2ResuableVector;

    // loop, drawing each strand segment
    for ( let i = 0; i < strandSegmentArray.length; i++ ) {
      const strandSegment = strandSegmentArray[ i ];
      const strandSegmentLength = strandSegment.length;
      context.moveTo( strandSegment[ 0 ].x, strandSegment[ 0 ].y );
      if ( strandSegmentLength === 1 || strandSegmentLength === 2 ) {

        // can't really create a curve from this, so draw a straight line to the end point and call it good
        context.lineTo(
          strandSegment[ strandSegmentLength - 1 ].x,
          strandSegment[ strandSegmentLength - 1 ].y
        );
        break;
      }

      // create the first curved segment
      cp1 = ShapeUtils.extrapolateControlPoint( strandSegment[ 2 ], strandSegment[ 1 ], strandSegment[ 0 ], cp1 );
      context.quadraticCurveTo( cp1.x, cp1.y, strandSegment[ 1 ].x, strandSegment[ 1 ].y );

      // create the middle segments
      for ( let j = 1; j < strandSegmentLength - 2; j++ ) {
        const segmentStartPoint = strandSegment[ j ];
        const segmentEndPoint = strandSegment[ j + 1 ];
        const previousPoint = strandSegment[ j - 1 ];
        const nextPoint = strandSegment[ ( j + 2 ) ];
        cp1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint, cp1 );
        cp2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint, cp2 );
        context.bezierCurveTo( cp1.x, cp1.y, cp2.x, cp2.y, segmentEndPoint.x, segmentEndPoint.y );
      }

      // create the final curved segment
      cp1 = ShapeUtils.extrapolateControlPoint(
        strandSegment[ strandSegmentLength - 3 ],
        strandSegment[ strandSegmentLength - 2 ],
        strandSegment[ strandSegmentLength - 1 ],
        cp1
      );
      context.quadraticCurveTo(
        cp1.x,
        cp1.y,
        strandSegment[ strandSegmentLength - 1 ].x,
        strandSegment[ strandSegmentLength - 1 ].y
      );
    }
    context.strokeStyle = strokeColor.computeCSS();
    context.lineWidth = this.backboneStrokeWidth;
    context.stroke();
  },

  /**
   * @override
   * Draws the DNA Molecule on canvas which includes helix like strands and base pairs.
   * @param {CanvasRenderingContext2D} context
   */
  paintCanvas: function( context ) {

    // map the segments of the DNA in the model to the arrays used in rendering
    for ( var i = 0; i < this.model.strand1Segments.length; i++ ) {
      const strand1Segment = this.model.strand1Segments[ i ];
      const strand2Segment = this.model.strand2Segments[ i ];

      const index = Math.floor( i / 2 );
      if ( i % 2 === 0 ) {
        this.strand2ArrayBehind[ index ] = strand2Segment;
        this.strand1ArrayFront[ index ] = strand1Segment;
      }
      else {
        this.strand1ArrayBehind[ index ] = strand1Segment;
        this.strand2ArrayFront[ index ] = strand2Segment;
      }
    }

    // draw the back portions of the DNA strand
    context.lineCap = 'round';
    this.drawStrandSegments( context, this.strand1ArrayBehind, STRAND_1_COLOR );
    this.drawStrandSegments( context, this.strand2ArrayBehind, STRAND_2_COLOR );

    // draw the base pairs
    context.lineCap = 'butt';
    context.beginPath();
    context.strokeStyle = BASE_PAIR_COLOR;
    for ( i = 0; i < this.model.basePairs.length; i++ ) {
      const basePair = this.model.basePairs[ i ];
      this.drawBasePair( context, basePair );
    }
    context.stroke();

    // draw the front portions of the DNA strand
    context.lineCap = 'round';
    this.drawStrandSegments( context, this.strand1ArrayFront, STRAND_1_COLOR );
    this.drawStrandSegments( context, this.strand2ArrayFront, STRAND_2_COLOR );
  },

  /**
   * Step Function which checks whether to redraw or not
   * @public
   */
  step: function() {
    if ( this.model.redraw ) {
      this.invalidatePaint();
    }
  }
} );