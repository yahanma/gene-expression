// Copyright 2015, University of Colorado Boulder

/**
 * Class that represents the DNA molecule in the view.
 *
 * @author Sharfudeen Ashraf
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var DnaMoleculeCanvasNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaMoleculeCanvasNode' );
  var geneExpressionEssentials = require( 'GENE_EXPRESSION_ESSENTIALS/geneExpressionEssentials' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Color = require( 'SCENERY/util/Color' );
  var GeneNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/GeneNode' );
  var DnaStrandSegmentNode = require( 'GENE_EXPRESSION_ESSENTIALS/common/view/DnaStrandSegmentNode' );

  // strings
  var geneString = require( 'string!GENE_EXPRESSION_ESSENTIALS/gene' );

  /**
   *
   * @param {DnaMolecule} dnaMolecule
   * @param {ModelViewTransform2} mvt
   * @param {number} backboneStrokeWidth
   * @param {boolean} showGeneBracketLabels
   * @constructor
   */
  function DnaMoleculeNode( dnaMolecule, mvt, backboneStrokeWidth, showGeneBracketLabels ) {
    var self = this;
    Node.call( self );


    // Add the layers onto which the various nodes that represent parts of the dna, the hints, etc. are placed.
    var geneBackgroundLayer = new Node();
    self.addChild( geneBackgroundLayer );

    // Layers for supporting the 3D look by allowing the "twist" to be depicted.
    this.dnaBackboneLayer = new DnaMoleculeCanvasNode( dnaMolecule, mvt, backboneStrokeWidth, {
      canvasBounds: new Bounds2(
        mvt.modelToViewX( dnaMolecule.getLeftEdgeXPos() ),
        mvt.modelToViewY( dnaMolecule.getTopEdgeYPos() ) - 10,
        mvt.modelToViewX( dnaMolecule.getRightEdgeXPos() ),
        mvt.modelToViewY( dnaMolecule.getBottomEdgeYPos() ) + 10
      )
    } );
    self.addChild( this.dnaBackboneLayer );

    // Put the gene backgrounds and labels behind everything.
    for ( var i = 0; i < dnaMolecule.getGenes().length; i++ ) {
      geneBackgroundLayer.addChild( new GeneNode( mvt, dnaMolecule.getGenes()[ i ], dnaMolecule,
        geneString + ( i + 1 ), showGeneBracketLabels ) );
    }

  }

  geneExpressionEssentials.register( 'DnaMoleculeNode', DnaMoleculeNode );

  return inherit( Node, DnaMoleculeNode, {

    step: function() {
      this.dnaBackboneLayer.step();
    }

  } );

} );

