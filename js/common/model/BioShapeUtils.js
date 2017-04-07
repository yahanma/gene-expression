// Copyright 2015, University of Colorado Boulder

/**
 * Several utilities for making it easier to create some complex and somewhat random shapes. This was created initially
 * to make it easier to create the shapes associated with biomolecules, but may have other uses.
 *
 * @author Sharfudeen Ashraf
 * @author Mohamed Safi
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var Matrix3 = require( 'DOT/Matrix3' );
  var Random = require( 'DOT/Random' );
  var Shape = require( 'KITE/Shape' );
  var ShapeUtils = require( 'GENE_EXPRESSION_ESSENTIALS/common/model/ShapeUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  var BioShapeUtils = {
    /**
     * Create a distorted shape from a list of points.  This is useful when trying to animate some sort of deviation
     * from a basic shape.
     * Note that this works best when the points are centered around the point (0, 0), and may not work at all otherwise
     * (it has never been tested).
     *
     * @param {Array.<Vector2>} points
     * @param {number} distortionFactor
     * @param {number} randomNumberSeed
     * @returns {Shape}
     * @public
     */
    createdDistortedRoundedShapeFromPoints: function( points, distortionFactor, randomNumberSeed ) {

      // Determine the center location of the undistorted shape.
      var undistortedShape = ShapeUtils.createRoundedShapeFromPoints( points );
      var undistortedShapeBounds = undistortedShape.bounds;
      var undistortedShapeCenter = undistortedShapeBounds.getCenter();

      var rand = new Random( {
        seed: randomNumberSeed
      } );

      // Alter the positions of the points that define the shape in order to define a distorted version of the shape.
      var alteredPoints = [];

      for ( var i = 0; i < points.length; i++ ) {
        var pointAsVector = points[ i ].copy();
        pointAsVector.multiplyScalar( 1 + ( rand.nextDouble() - 0.5 ) * distortionFactor );
        alteredPoints.push( pointAsVector );
      }

      // Create the basis for the new shape.
      var distortedShape = ShapeUtils.createRoundedShapeFromPoints( alteredPoints );

      // Determine the center of the new shape.
      var distortedShapeCenter = distortedShape.bounds.getCenter();

      // Shift the new shape so that the center is in the same place as the old one.
      var translationMatrix = Matrix3.translation( undistortedShapeCenter.x - distortedShapeCenter.x,
        undistortedShapeCenter.y - distortedShapeCenter.y );

      distortedShape = distortedShape.transformed( translationMatrix );

      return distortedShape;
    },

    /**
     * Create a shape based on a set of points. The points must be in an order that, if connected by straight lines,
     * would form a closed shape. Some of the segments will be straight lines and some will be curved, and which is
     * which will be based on a pseudo-random variable.
     *
     * @param {Array.<Vector2>} points
     * @param {number} seed
     * @returns {Shape}
     * @private
     */
    createRandomShapeFromPoints: function( points, seed ) {
      var path = new Shape();
      var rand = new Random( {
        seed: seed
      } );
      path.moveToPoint( points[ 0 ] );
      for ( var i = 0; i < points.length; i++ ) {
        var segmentStartPoint = points[ i ];
        var segmentEndPoint = points[ ( i + 1 ) % points.length ];
        var previousPoint = points[ i - 1 >= 0 ? i - 1 : points.length - 1 ];
        var nextPoint = points[ ( i + 2 ) % points.length ];
        var controlPoint1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
        var controlPoint2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
        if ( rand.nextBoolean() ) {
          // Curved segment.
          path.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, segmentEndPoint.x, segmentEndPoint.y );
        }
        else {
          // Straight segment.
          path.lineTo( segmentEndPoint.x, segmentEndPoint.y );
        }
      }
      return path;
    },

    /**
     * Calls createRandomShapeFromPoints to create random shape
     * @param {Dimension2} size
     * @param {number} seed
     * @returns {Shape}
     * @public
     */
    createRandomShape: function( size, seed ) {
      var pointList = [];
      var rand = new Random( {
        seed: seed
      } );
      // Create a series of points that will enclose a space.
      for ( var angle = 0; angle < 1.9 * Math.PI; angle += Math.PI / 10 + rand.nextDouble() * Math.PI / 10 ) {
        pointList.push( Vector2.createPolar( 0.5 + rand.nextDouble(), angle ) );
      }

      var unscaledShape = this.createRandomShapeFromPoints( pointList, seed );
      var unscaledShapeBounds = unscaledShape.bounds;

      // Scale the shape to the specified size.
      var horizontalScale = size.width / unscaledShapeBounds.width;
      var verticalScale = size.height / unscaledShapeBounds.height;

      var scaledMatrix = Matrix3.scaling( horizontalScale, verticalScale );
      return unscaledShape.transformed( scaledMatrix );
    },

    /**
     * Create a curvy line from a list of points. The points are assumed to be in order.
     *
     * @param {Array.<Vector2>} points
     * @returns {Shape}
     * @public
     */
    createCurvyLineFromPoints: function( points ) {
      assert && assert( points.length > 0 );

      // Control points, used throughout the code below for curving the line.
      var cp1;

      var path = new Shape();
      path.moveTo( points[ 0 ].x, points[ 0 ].y );
      if ( points.length === 1 || points.length === 2 ) {
        // Can't really create a curve from this, so draw a straight line
        // to the end point and call it good.
        path.lineTo( points[ points.length - 1 ].x, points[ points.length - 1 ].y );
        return path;
      }
      // Create the first curved segment.
      cp1 = ShapeUtils.extrapolateControlPoint( points[ 2 ], points[ 1 ], points[ 0 ] );
      path.quadraticCurveTo( cp1.x, cp1.y, points[ 1 ].x, points[ 1 ].y );
      // Create the middle segments.
      for ( var i = 1; i < points.length - 2; i++ ) {
        var segmentStartPoint = points[ i ];
        var segmentEndPoint = points[ i + 1 ];
        var previousPoint = points[ i - 1 ];
        var nextPoint = points[ ( i + 2 ) ];
        var controlPoint1 = ShapeUtils.extrapolateControlPoint( previousPoint, segmentStartPoint, segmentEndPoint );
        var controlPoint2 = ShapeUtils.extrapolateControlPoint( nextPoint, segmentEndPoint, segmentStartPoint );
        path.cubicCurveTo( controlPoint1.x, controlPoint1.y, controlPoint2.x, controlPoint2.y, segmentEndPoint.x,
          segmentEndPoint.y );
      }
      // Create the final curved segment.
      cp1 = ShapeUtils.extrapolateControlPoint( points[ points.length - 3 ], points[ points.length - 2 ],
        points[ points.length - 1 ] );

      path.quadraticCurveTo( cp1.x, cp1.y, points[ points.length - 1 ].x, points[ points.length - 1 ].y );
      return path;
    },

    /**
     * Create a shape that looks roughly like a 2D representation of E. Coli, which is essentially a rectangle with
     * round ends. Some randomization is added to the shape to make it look more like a natural object.
     *
     * @param {number} width
     * @param {number} height
     * @returns {Shape}
     * @public
     */
    createEColiLikeShape: function( width, height ) {
      assert && assert( width > height ); // Param checking.  Can't create the needed shape if this isn't true.

      // Tweakable parameters that affect number of points used to define the shape.
      var numPointsPerLineSegment = 8;
      var numPointsPerCurvedSegment = 8;

      // Adjustable parameter that affects the degree to which the shape is altered to make it look somewhat irregular.
      // Zero means no change from the perfect geometric shape, 1 means a lot of variation.
      var alterationFactor = 0.025;

      // The list of points that will define the shape.
      var pointList = [];

      // Random number generator used for deviation from the perfect geometric shape.
      var rand = new Random( {
        seed: 45 // empirically determined to make shape look distorted
      } );


      // Variables needed for the calculations.
      var curveRadius = height / 2;
      var lineLength = width - height;
      var rightCurveCenterX = width / 2 - height / 2;
      var leftCurveCenterX = -width / 2 + height / 2;
      var centerY = 0;
      var angle = 0;
      var radius = 0;
      var nextPoint = null;

      // Create a shape that is like E. Coli. Start at the left side of the line that defines the top edge and move
      // around the shape in a clockwise direction.

      // Add points for the top line.
      for ( var i = 0; i < numPointsPerLineSegment; i++ ) {
        nextPoint = new Vector2( leftCurveCenterX + i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY - height / 2 );
        nextPoint.setXY( nextPoint.x, nextPoint.y + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
        pointList.push( nextPoint );
      }

      // Add points that define the right curved edge. Skip what would be the first point, because it would overlap with
      // the previous segment.
      for ( i = 1; i < numPointsPerCurvedSegment; i++ ) {
        angle = -Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
        radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
        pointList.push( new Vector2( rightCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
      }

      // Add points that define the bottom line. Skip what would be the first point, because it would overlap with the
      // previous segment.
      for ( i = 1; i < numPointsPerLineSegment; i++ ) {
        nextPoint = new Vector2( rightCurveCenterX - i * ( lineLength / ( numPointsPerLineSegment - 1 ) ), centerY + height / 2 );
        nextPoint.setXY( nextPoint.x, nextPoint.y + ( rand.nextDouble() - 0.5 ) * height * alterationFactor );
        pointList.push( nextPoint );
      }

      // Add points that define the left curved side. Skip what would be the first point and last points, because the
      // would overlap with the previous and next segment (respectively).
      for ( i = 1; i < numPointsPerCurvedSegment - 1; i++ ) {
        angle = Math.PI / 2 + i * ( Math.PI / ( numPointsPerCurvedSegment - 1 ) );
        radius = curveRadius + ( rand.nextDouble() - 0.5 ) * height * alterationFactor;
        pointList.push( new Vector2( leftCurveCenterX + radius * Math.cos( angle ), radius * Math.sin( angle ) ) );
      }

      // Create the unrotated and untranslated shape.
      return ShapeUtils.createRoundedShapeFromPoints( pointList );
    }
  };

  geneExpressionEssentials.register( 'BioShapeUtils', BioShapeUtils );

  return BioShapeUtils;
} );