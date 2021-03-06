// Copyright 2015-2020, University of Colorado Boulder

/**
 * Node that represents a cell (as in a biological organism) that changes color as the level of protein within the cell
 * changes. The color change is meant to represent a cell that is expressing a fluorescent protein, something like
 * Green Fluorescent Protein, or GFP.
 *
 * @author John Blanco
 * @author Mohamed Safi
 * @author Aadish Gupta
 */

import Utils from '../../../../dot/js/Utils.js';
import inherit from '../../../../phet-core/js/inherit.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Path from '../../../../scenery/js/nodes/Path.js';
import Color from '../../../../scenery/js/util/Color.js';
import geneExpressionEssentials from '../../geneExpressionEssentials.js';
import Cell from '../model/Cell.js';

// constants
const NOMINAL_FILL_COLOR = new Color( 30, 30, 40 ); // Blue Gray
const FLORESCENT_FILL_COLOR = new Color( 200, 255, 58 );
const LINE_WIDTH = 2;
const STROKE_COLOR = Color.WHITE;

/**
 * @param {Cell} cell
 * @param {ModelViewTransform2} modelViewTransform
 * @constructor
 */
function ColorChangingCellNode( cell, modelViewTransform ) {
  Node.call( this );

  const cellBody = new Path( modelViewTransform.modelToViewShape( cell.getShape() ), {
    fill: NOMINAL_FILL_COLOR,
    stroke: STROKE_COLOR,
    lineWidth: LINE_WIDTH,
    lineJoin: 'round',
    boundsMethod: 'unstroked',
    center: modelViewTransform.modelToViewXY( cell.positionX, cell.positionY )
  } );

  cell.proteinCount.lazyLink( function( proteinCount ) {
    const florescenceAmount = Utils.clamp( ( proteinCount - Cell.ProteinLevelWhereColorChangeStarts ) /
                                           ( Cell.ProteinLevelWhereColorChangeCompletes - Cell.ProteinLevelWhereColorChangeStarts ), 0, 1.0 );
    cellBody.fill = Color.interpolateRGBA( NOMINAL_FILL_COLOR, FLORESCENT_FILL_COLOR, florescenceAmount );
  } );
  this.addChild( cellBody );
}

geneExpressionEssentials.register( 'ColorChangingCellNode', ColorChangingCellNode );

inherit( Node, ColorChangingCellNode, {}, {

  // statics
  NominalFillColor: NOMINAL_FILL_COLOR,
  FlorescentFillColor: FLORESCENT_FILL_COLOR
} );

export default ColorChangingCellNode;