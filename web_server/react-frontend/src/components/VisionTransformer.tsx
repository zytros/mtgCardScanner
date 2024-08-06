/*
Component for visualizing vision transformer architecture 
Steps to get libraries 
 npm install d3
 Maybe next time try - yarn add d3
*/ 
  
import React, { useEffect, useRef,useState } from 'react';
import { getImage } from '../router/resources/data';
import * as d3 from 'd3';


function makeGroup1(svg:any,ency:number){
  const g1 = svg.append('g')
        // Moves the entire group 100px right and 100px down
        .attr('transform', 'translate(100, 100)');  

  const ecx = 0;
  const ecy = 0;
  const erx = 30;
  const ery = 50;
  // Class Output 
  g1.append('ellipse')
    .attr('cx', ecx) //center of ecllipse
    .attr('cy', ecy)
    //radius of ellipse 
    .attr('rx', erx) 
    .attr('ry', ery)
    .style('fill', 'none')
    .style('stroke', 'black');
  
    const RectLeftMostCornerX = 100;
    const RectLeftMostCornerY = -25;
    const width = 100;
    const height = 50;
    const TextCenterX = RectLeftMostCornerX + width/2;
    const TextCenterY = RectLeftMostCornerY + height/2;
    

    // MLP Head
    g1.append('rect')
        // when you do cx, its relative to d3container. 
        // x is now translated anyways bc of group translation 
      .attr('x', RectLeftMostCornerX) 
      .attr('y', RectLeftMostCornerY)
      .attr('width', width)
      .attr('height', height)
      .style('fill', 'none')
      .style('stroke', 'black');

  g1.append('text')
      .attr('x', 0)
      .attr('y', 0)
      // Center the text horizontally and vertically to the given x and y axis 
      .attr('text-anchor', 'middle')  
      .attr('dominant-baseline', 'middle')  
      .text('Class');
  
  g1.append('text')
    .attr('x', TextCenterX)  // Center x: start of rectangle + half of its width
    .attr('y', TextCenterY)    // Center y: start of rectangle + half of its height
    .attr('text-anchor', 'middle')  
    .attr('dominant-baseline', 'middle')  
    .text('MLP Head');
  
  // Line between Eclipse and rectangle 
  const startX = ecx+erx;  // Right side of the ellipse (ellipse's cx + rx)
  const startY = ecy;   // Vertical center of the ellipse (ellipse's cy)
  const endX = RectLeftMostCornerX;   // Left side of the rectangle (rectangle's x)
  const endY = RectLeftMostCornerY+height/2;     // Vertical center of the rectangle (rectangle's y + height / 2)

  g1.append('line')
    .attr('x1', endX)    // End x: left of rectangle
    .attr('y1', endY)    // End y: center y of rectangle
    .attr('x2', startX+5)  // Start x: right of ellipse
    .attr('y2', startY)  // Start y: center y of ellipse
    .attr('marker-end', 'url(#arrowhead)')
    .style('stroke', 'black')  // Color of the line
    .style('stroke-width', 2); // Thickness of the line
  // Line from Encoder to MLP Head 
  g1.append('line')
    .attr('x1', TextCenterX)
    .attr('y1', ency)
    .attr('x2', TextCenterX)
    .attr('y2', TextCenterY +height/2 + 5)
    .attr('marker-end', 'url(#arrowhead)')
    .style('stroke-width', 2)
    .style('stroke', 'black');

  const firstTextHeight = 300;
  g1.append('text')
    .attr('x',0)
    .attr('y',firstTextHeight)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle') 
    .attr("font-weight",700)
    .attr("fill","#6c1236")
    .text('Patch +');
  g1.append('text')
    .attr('x',0)
    .attr('y',firstTextHeight+20)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle') 
    .attr("font-weight",700)
    .attr("fill","#d11761")
    .text('Positional Embedding');
  g1.append('text')
    .attr('x',0)
    .attr('y',firstTextHeight+20*2)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle') 
    .attr("font-weight",500)
    .text('(*) is an extra learnable');
  g1.append('text')
    .attr('x',0)
    .attr('y',firstTextHeight+20*3)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle') 
    .attr("font-weight",500)
    .text('class embedding');
};

function makeGroup2(svg:any, rectWidth:number,rectHeight:number,spacing:number){
      

      // Data for the rectangles
      const data = ["0", "*", "1","", "2","", "3","", "4","", "5","", "6","", "7","", "8","", "9",""];

      // Select the SVG container where you want to add the shapes

      const g2 = svg.append('g')
              .attr('transform', 'translate(200, 400)');  
      


      // Create the rectangles of embeddings - not the pictures 
      g2.selectAll('rect')
          //One to one of element of data => Rectangle 
          .data(data)
          //enter is called on the selection to create a placeholder for each data item that does not already have an associated rect element on the page
          .enter()
          .append('rect')
          //.attr('x', (d, i) => i * rectWidth) // Position based on the index
          .attr('x', (d:string, i:number) => i %2 === 0 ? i * rectWidth+ i/2 * spacing: rectWidth *i+(i-1)/2*spacing )
          .attr('y', 0) // Align at the top
          .attr('rx', 4) 
          .attr('ry', 4)
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .style('fill', (d:string, i:number) => i%2===0? '#6c1236' :"#d11761")
          .style('stroke', 'black');

      
      
      
      // Add text to the rectangles
      g2.selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('x', (d:string, i:number) => i %2 ===0 ? i * rectWidth+ i/2 * spacing + rectWidth/2: rectWidth *i+(i-1)/2*spacing + rectWidth/2) 
          .attr('y', rectHeight / 2) // Center the text vertically
          .attr('text-anchor', 'middle') // Center the text horizontally
          .attr('dominant-baseline', 'middle') // Center the text vertically
          .attr("fill", "white")
          .text((d: any) => d);

      data.forEach((elem, i) => {
          // For each pair, create oneline 
          for (let j = 0; j < data.length; j++) {
            if (j%2 ===0){
              g2.append('line')
                .attr('x1', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y1', 0 ) 
                .attr('x2', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y2', -(3/4)*rectHeight) 
                .style('stroke', 'black')
                .style('stroke-width', 1)
                .attr('marker-end', 'url(#arrowhead)');
            }
            //line that goes from rectangles to linear projection layer 
            if (j%2 ===0 && j >1){
              g2.append('line')
                .attr('x1', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y1', rectHeight ) 
                .attr('x2', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y2', rectHeight+(1/2)*rectHeight) 
                .style('stroke', 'black')
                .style('stroke-width', 1)
            }
          }
      })
      
      // Linear Projection Box short : lpb 
      // left most corner coordinate of this box is lpbx and lpby
      const lpbx = rectWidth*2+spacing
      const lpby = rectHeight +(1/2) * rectHeight
      //widht of the box depend son the rect 
      const lphbWidth = rectWidth *18+ (17)/2*spacing 
      const lphbHeight = 50
      g2.append('rect')
        .attr('x', lpbx)
        .attr('y', lpby)
        .attr('width', lphbWidth)
        .attr('height',lphbHeight)
        .attr('rx',20)
        .attr('ry',20)
        .style('fill', '#6c1236')
        .style('stroke', 'black');
      ;

      g2.append('text')
        .attr('x', rectWidth*2+spacing + (rectWidth *18+ (17)/2*spacing)/2 )
        .attr('y', lpby +lphbHeight/2)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle')
        .attr("fill", "white")
        .text('Linear Projection of Flattened Patches');
          
      data.forEach((elem, i) => {
          // For each pair, create oneline 
          for (let j = 0; j < data.length; j++) {
            if (j%2 ===0 && j >1){
              //this is the line that goes from below linear projection layer to square images 
              g2.append('line')
                .attr('x1', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                // from g2's origin + rectHeight + line that goes from linear projection layer +lphbHeight 
                .attr('y1', rectHeight + (1/2)*rectHeight+ lphbHeight ) 
                .attr('x2', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y2', 2 * rectHeight+lphbHeight ) 
                .style('stroke', 'black')
                .style('stroke-width', 1);
              // Add a square for images 
              // ix , iy denote start coordinate of the image square 
              // it has to be square so width and height should be same. We call this "size" 
              var ix = j* rectWidth+ j/2 * spacing;
              const iy = 2 * rectHeight+lphbHeight; 
              const size = (3/2) * rectHeight

              /*
              g2.append('rect')
                .attr('x', ix) 
                // from g2's origin + rectHeight + line that goes from linear projection layer +lphbHeight 
                .attr('y', iy ) 
                .attr('width', size)
                .attr('height',size)
                .style('fill', 'none')
                .style('stroke', 'black'); */

              g2.append('text')
                .attr('x', ix+size/2-10) 
                // from g2's origin + rectHeight + line that goes from linear projection layer +lphbHeight 
                .attr('y', iy+size+20) 
                .attr('text-anchor', 'middle') 
                .attr('dominant-baseline', 'middle')
                .text(data[j]);
            }
          }
      })

}

function makeGroup3(svg:any,rectHeight:number){
  /*
  //display original image position. We set it to 100,600 just cause lmao 
  const g3 =svg.append('g')
    .attr('transform', 'translate(100,600)');;

  const data = [1,2,3,4,5,6,7,8,9]; // Creates an array [1, 2, ..., 9]
  const s = (3/2) * rectHeight; // Size of each square
  const x = 0; // x-coordinate of the top-left corner of the grid
  const y = 0; // y-coordinate of the top-left corner of the grid
  
  g3.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (d:number, i:number) => i < 3 ? x : i < 6 ? x + s : x + 2 * s)
    .attr('y', (d:number, i:number) => i < 3 ? y : i < 6 ? y + s : y + 2 * s )
    .attr("width", s)
    .attr("height", s)
    .attr("fill", "none")
    .attr("stroke", "black");
  
  g3.selectAll('text')
    .attr("x", s / 2) // Center text horizontally
    .attr("y", s / 2) // Center text vertically
    .attr("text-anchor", "middle") // Ensure text is centered
    .attr('dominant-baseline', 'middle')
    .text((d:number) => String(d));
  */
}

function makeEncoder(svg:any,encx:number, ency:number,EncoderWidth:number ,EncoderHeight:number,archx:number,archy:number,archwidth:number,archheight:number): d3.Selection<SVGRectElement, unknown, HTMLElement, any>{

      //const EncoderHeight;
      const g4 = svg.append('g')
      g4.append('rect')
        .attr('x', encx)
        .attr('y', ency)
        .attr('width', EncoderWidth)
        .attr('height', EncoderHeight)
        .style('fill', '#3a0b97')
        .style('stroke', 'black')
        .attr("rx", 20)
        .attr("ry", 20)

      g4.append('text')
        .attr('x', EncoderWidth/2)
        .attr('y', 195)
        .text('Transformer Encoder');

      //Infotext height - click me 
      const infox = encx +EncoderWidth/4;
      const infoy = ency +EncoderHeight/2;
      g4.append('text')
        .attr('x',infox)
        .attr('y',infoy)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle') 
        .attr("font-weight",700)
        .attr("fill", "white")
        .text("Click on the first transformer block")
      g4.append('text')
        .attr('x',infox)
        .attr('y',infoy +20)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle') 
        .attr("font-weight",700)
        .attr("fill", "white")
        .text("to see the architecture")

      const block1x = encx+(0.55) *EncoderWidth;
      const block1y = ency+EncoderHeight/10;
      const blockwidth = (0.4)*EncoderWidth;
      const blockheight = EncoderHeight/4;

      const block = g4.append('rect')
        .attr('x', block1x)
        .attr('y', block1y)
        .attr('width', blockwidth)
        .attr('height', blockheight)
        .style('fill', 'none')
        .style('stroke', 'white')
        .attr("rx", 10)
        .attr("ry", 10)
        .style("pointer-events","visible")
        .on("mouseover", function(this:any,event:any) {
          // handle events here
            // d - datum
            // i - identifier or index
            // this - the `<rect>` that was clicked
          d3.select(this).style('fill', '#8558de');
          event.stopPropagation();
        })
        .on("mouseout", function(this:any,event:any) {
          // handle events here
            // d - datum
            // i - identifier or index
            // this - the `<rect>` that was clicked
          d3.select(this).style('fill', 'None');
          event.stopPropagation();
        });
        g4.append('text')
        .attr('x',block1x +blockwidth/2)
        .attr('y',block1y +blockheight/2)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle')
        .attr("fill", "white") 
        .text("Transformer block 1")
        .style("pointer-events", "none");
      //Dot dot dot 
      g4.append('circle')
        .attr('cx',block1x +blockwidth/2)
        .attr('cy',block1y +blockheight+12)
        .attr('r',2)
        .attr('stroke', 'white')
        .attr('fill', 'white');
      g4.append('circle')
        .attr('cx',block1x +blockwidth/2)
        .attr('cy',block1y +blockheight+24)
        .attr('r',2)
        .attr('stroke', 'white')
        .attr('fill', 'white');
      g4.append('circle')
        .attr('cx',block1x +blockwidth/2)
        .attr('cy',block1y +blockheight+36)
        .attr('r',2)
        .attr('stroke', 'white')
        .attr('fill', 'white');
      const block2x = encx+(0.55) *EncoderWidth;
      const block2y = block1y+blockheight+48;
      g4.append('rect')
        .attr('x', block2x)
        .attr('y', block2y)
        .attr('width', blockwidth)
        .attr('height', blockheight)
        .style('fill', 'none')
        .style('stroke', 'white')
        .attr("rx", 10)
        .attr("ry", 10)
      g4.append('text')
        .attr('x',block2x +blockwidth/2)
        .attr('y',block2y +blockheight/2)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle') 
        .attr('fill', 'white')
        .text("Transformer block k");
      
      /*
      DANGER ZONE - NOT SURE IF THIS IS THE RIGHT WAY TO DO 
      BLOCK ARCH CAN BE ALSO ASSIGNED AS 'BIBIBU' IF BLOCK IS NOT CLICKED  
      HOPEFULLY THIS IS UNKNOWN WHEN ITS NOT CLICKED 
      */ 
      var blockarch:d3.Selection<SVGRectElement, unknown, HTMLElement, any> =d3.select('BIBIBU');
      block.on("click", function(this:any,event:any) {
           blockarch = svg.append('rect')
              .attr('x', archx)
              .attr('y', archy)
              .attr('width', archwidth)
              .attr('height', archheight)
              .style('fill', 'none')
              .style('stroke', '#af8df3')
              .attr("rx", 10)
              .attr("ry", 10)
              .style("pointer-events","visible");

            svg.append('text')
              .attr('x', archx+10)
              .attr('y', archy-8)
              .attr("font-weight",700)
              .attr("fill", "#3a0b97")
              .text('Structure of a block');

            // svg.append('line')
            //   .attr('x1',encx+EncoderWidth)
            //   .attr('y1', ency)
            //   .attr('x2',archx)
            //   .attr('y2', archy)
            //   .attr('stroke', 'black')
            //   .style('stroke-width', 1);
            // svg.append('line')
            //   .attr('x1',encx+EncoderWidth)
            //   .attr('y1', ency+EncoderHeight)
            //   .attr('x2',archx)
            //   .attr('y2', archy+archheight)
            //   .attr('stroke', 'black')
            //   .style('stroke-width', 1);
            svg.append('path')
              .attr('d', `M ${encx + EncoderWidth} ${ency+25}  L ${encx+EncoderWidth} ${ency+EncoderHeight-25} L ${archx} ${archy+archheight-6} L ${archx} ${archy+6} Z`)
              .style('fill', '#af8df3')
              .style('stroke', '#af8df3');
            //skip connection 
            svg.append('line')
              .attr('x1',archx+archwidth/2)
              .attr('y1', archy + (1/12)*archheight-archwidth/12)
              .attr('x2',archx+archwidth/2)
              .attr('y2', archy)
              .attr('stroke', 'black')
              .attr('marker-end', 'url(#arrowhead)')
              .style('stroke-width', 2);
            svg.append('circle')
              .attr('cx', archx+archwidth/2)
              .attr('cy', archy + (1/12)*archheight)
              .attr('r',archwidth/12)
              .attr('stroke', 'black')
              .style('fill','None');
            svg.append('line')
              .attr('x1',archx+archwidth/2-archwidth/12)
              .attr('y1', archy + (1/12)*archheight)
              .attr('x2',archx+archwidth/2+archwidth/12)
              .attr('y2', archy + (1/12)*archheight)
              .attr('stroke', 'black')
              .style('stroke-width', 2);
            svg.append('line')
              .attr('x1',archx+archwidth/2)
              .attr('y1', archy + (1/12)*archheight-archwidth/12)
              .attr('x2',archx+archwidth/2)
              .attr('y2', archy + (1/12)*archheight+archwidth/12)
              .attr('stroke', 'black')
              .style('stroke-width', 2);
            svg.append('line')
              .attr('x2',archx+archwidth/2)
              .attr('y2', archy + (1/12)*archheight+archwidth/12)
              .attr('x1',archx+archwidth/2)
              .attr('y1', archy + (1/6)*archheight)
              .attr('stroke', 'black')
              .attr('marker-end', 'url(#arrowhead)')
              .style('stroke-width', 2);
            
            svg.append('rect')
              .attr('x', archx+archwidth/6)
              .attr('y', archy + (1/6)*archheight)
              .attr('width', (2/3)*archwidth)
              .attr('height', archheight/9)
              .attr('stroke', '#10277a')
              .attr("rx", 10)
              .attr("ry", 10)
              .style('fill','#10277a');
            svg.append('text')
              .attr('x',archx+archwidth/6+(2/3)*archwidth/2)
              .attr('y',archy + (1/6)*archheight+archheight/9/2)
              .attr('text-anchor', 'middle') 
              .attr('dominant-baseline', 'middle') 
              .attr("font-weight",700)
              .attr("fill", "white")
              .text('MLP');

            svg.append('line')
              .attr('x2',archx+archwidth/2)
              .attr('y2', archy + (1/6)*archheight+archheight/9)
              .attr('x1',archx+archwidth/2)
              .attr('y1', archy + (2/6)*archheight-5)
              .attr('stroke', '#3a0b97')
              .attr('marker-end', 'url(#arrowhead)')
              .style('stroke-width', 2);

            svg.append('rect')
              .attr('x', archx+archwidth/6)
              .attr('y', archy + (2/6)*archheight)
              .attr('width', (2/3)*archwidth)
              .attr('height', archheight/9)
              .attr('stroke', 'black')
              .attr("rx", 10)
              .attr("ry", 10)
              .style('fill','#facea0');
            
            svg.append('text')
              .attr('x',archx+archwidth/6+(2/3)*archwidth/2)
              .attr('y',archy + (2/6)*archheight+(archheight/9)/2)
              .attr('text-anchor', 'middle') 
              .attr('dominant-baseline', 'middle') 
              .attr("font-weight",700)
              .text('Norm');
            
            svg.append('line')
              .attr('x2',archx+archwidth/2)
              .attr('y2', archy + (2/6)*archheight+archheight/9)
              .attr('x1',archx+archwidth/2)
              .attr('y1', archy + (1/2)*archheight+10+archwidth/12)
              .attr('stroke', 'black')
              .attr('marker-end', 'url(#arrowhead)')
              .style('stroke-width', 2);

            svg.append('circle')
              .attr('cx', archx+archwidth/2)
              .attr('cy', archy + (1/2)*archheight+10)
              .attr('r',archwidth/12)
              .attr('stroke', 'black')
              .style('fill','None');
            
            
            svg.append('line')
              .attr('x2', archx+archwidth/2)
              .attr('y2',  archy + (1/2)*archheight+10-archwidth/12)
              .attr('x1', archx+archwidth/2)
              .attr('y1', archy + (1/2)*archheight+10+archwidth/12)
              .attr('stroke', 'black')
              .style('stroke-width', 2);
            svg.append('line')
              .attr('x1', archx+archwidth/2-archwidth/12)
              .attr('y1',  archy + (1/2)*archheight+10)
              .attr('x2', archx+archwidth/2+archwidth/12)
              .attr('y2', archy + (1/2)*archheight+10)
              .attr('stroke', 'black')
              .style('stroke-width', 2);

            svg.append('line')
              .attr('x2',archx+archwidth/2)
              .attr('y2', archy + (1/2)*archheight)
              .attr('x1',archx+archwidth/2)
              .attr('y1',archy + (1/2)*archheight+40)
              .attr('stroke', 'black')
              .style('stroke-width', 2);

            svg.append('rect')
              .attr('x', archx+archwidth/6)
              .attr('y', archy + (1/2)*archheight+40)
              .attr('width', (2/3)*archwidth)
              .attr('height', archheight/7)
              .attr('stroke', 'black')
              .attr("rx", 10)
              .attr("ry", 10)
              .style('fill','#34692e');
            
            svg.append('text')
              .attr('x',archx+archwidth/6+(2/3)*archwidth/2)
              .attr('y',archy + (1/2)*archheight+35+(archheight/7)/2-2)
              .attr('text-anchor', 'middle') 
              .attr('dominant-baseline', 'middle') 
              .attr("font-weight",700)
              .attr("fill", "white")
              .text('Multi-head');
            svg.append('text')
              .attr('x',archx+archwidth/6+(2/3)*archwidth/2)
              .attr('y',archy + (1/2)*archheight+40+(archheight/7)/2+13)
              .attr('text-anchor', 'middle') 
              .attr('dominant-baseline', 'middle') 
              .attr("font-weight",700)
              .attr("fill", "white")
              .text('Attention');
            
            svg.append('line')
              .attr('x1',archx+archwidth/2)
              .attr('y1',archy + (5/6)*archheight)
              .attr('x2',archx+archwidth/2)
              .attr('y2',archy + (1/2)*archheight+40+archheight/7)
              .attr('marker-end', 'url(#arrowhead)')
              .attr('stroke', 'black')
              .style('stroke-width', 2);
            svg.append('rect')
              .attr('x', archx+archwidth/6)
              .attr('y', archy + (5/6)*archheight)
              .attr('width', (2/3)*archwidth)
              .attr('height', archheight/9)
              .attr('stroke', 'black')
              .attr("rx", 10)
              .attr("ry", 10)
              .style('fill','#facea0');
            
            svg.append('text')
              .attr('x',archx+archwidth/6+(2/3)*archwidth/2)
              .attr('y',archy + (5/6)*archheight+archheight/9/2)
              .attr('text-anchor', 'middle') 
              .attr('dominant-baseline', 'middle') 
              .attr("font-weight",700)
              .text('Norm');
            
            svg.append('line')
              .attr('x2',archx+archwidth/2)
              .attr('y2',archy + (5/6)*archheight+archheight/9)
              .attr('x1',archx+archwidth/2)
              .attr('y1',archy + archheight)
              .attr('marker-end', 'url(#arrowhead)')
              .attr('stroke', 'black')
              .style('stroke-width', 2);
            
            interface Point {
                x: number;
                y: number;
            }
            
            let FirstSkip :Point[]  = [
                { x: archx+archwidth/2 +archwidth/12, y: archy + (1/2)*archheight+10 },
                { x: archx+archwidth/2 +archwidth/12+archwidth/3, y: archy + (1/2)*archheight+10 },
                { x: archx+archwidth/2 +archwidth/12+archwidth/3, y: archy +(24/25)*archheight +10},
                { x: archx+archwidth/2, y: archy +(24/25)*archheight + 10 }
            ];
            const lineGenerator = d3.line<Point>()
              .x((d: Point) => d.x)
              .y((d: Point) => d.y);
            svg.append("path")
              .attr("d", lineGenerator(FirstSkip.reverse()))
              .attr("fill", "none")
              .attr("stroke", "black")
              .style('stroke-width', 2)
              .attr("marker-end", "url(#arrowhead)");

            let SecondSkip :Point[]  = [
                { x: archx+archwidth/2 +archwidth/12, y:archy + (1/12)*archheight },
                { x: archx+archwidth/2 +archwidth/12+archwidth/3, y: archy + (1/12)*archheight},
                { x: archx+archwidth/2 +archwidth/12+archwidth/3, y: archy + (1/2)*archheight - 10},
                { x: archx+archwidth/2 , y: archy + (1/2)*archheight - 10}
            ];
            svg.append("path")
              .attr("d", lineGenerator(SecondSkip.reverse()))
              .attr("fill", "none")
              .attr("stroke", "black")
              .style('stroke-width', 2)
              .attr("marker-end", "url(#arrowhead)");

            /*
            svg.append('circle')
              .attr('cx', archx+archwidth/2)
              .attr('cy', archy + (4/10)*archheight)
              .attr('r',archwidth/12)
              .attr('stroke', 'black')
              .style('fill','None')
            svg.append('rect')
              .attr('x', archx+archwidth/9)
              .attr('y', archy + (5/10)*archheight)
              .attr('width', (4/5)*archwidth)
              .attr('height', archheight/9)
              .attr('stroke', 'black')
              .attr("rx", 10)
              .attr("ry", 10)
              .style('fill','None');*/
  
          event.stopPropagation();
          //TODO add lines - maybe they can be fancy transitions 
      });
      if (blockarch){return blockarch;}
      else{return blockarch;}

}
interface Props {
  folder_path: string;
  images: string[];
}

const VisionTransformer: React.FC<Props> = ({folder_path, images })=> {
  const [Images, setImages] = useState<string[]>([]);
  /*
  useRef 
  -get a reference to the DOM element where you want to append the SVG
  useState
  - to store data for visualization 
  useEffect
  - useEffect hook will be used to execute the D3.js code to create the circle once the component has mounted
  */

  const d3Container = useRef(null);
  /*
  The useEffect hook is called, defining a function to run after the component mounts or updates.
  Since the dependency array is empty, it will only execute after the initial render (component mount).
  */ 
  useEffect(() => {

      /*
      Checks if svg element d3Contrainer references has been rendered and the ref has been attached to the DOM element.
      */ 
      if (d3Container.current&& Images.length > 0) {
        // Select the SVG element using D3
        const svg = d3.select(d3Container.current)
          .append('svg')
          .attr('width',1030)
          .attr('height',800)

        //Helpfer function for creating marker
        svg.append('defs').append('marker')
          .attr('id', 'arrowhead')
          .attr('viewBox', '-0 -5 10 10') // Coordinates of the viewBox
          .attr('refX', 5) // The x-coordinate on the marker for the reference point
          .attr('refY', 0) // The y-coordinate on the marker for the reference point
          .attr('orient', 'auto') // The orientation of the marker
          .attr('markerWidth', 6) // The marker width
          .attr('markerHeight', 6) // The marker height
          .attr('xoverflow', 'visible') // Ensure the entire marker is visible
        .append('svg:path')
          .attr('d', 'M 0,-5 L 10,0 L 0,5') // The path for the arrowhead shape
          .attr('fill', 'black'); // The fill color for the arrowhead

        /* 
        Entire group is created and translated to (100,100)
        this will draw eclipse of classes , mlp head, text "Patch+Position
        Embedding
        (*) is extra learnable
        [class] embedding"
        */
        const ency = 200;
        makeGroup1(svg,ency);
        // New group for input processing 
        // First the embedding 
        // Define the fixed width and height for the rectangles
        const rectWidth = 20; 
        const rectHeight = 30; 
        const spacing = 10;
        const imagewidthAndHeight = (3/2) *rectHeight
        
        //make nput processing pipeline 
        makeGroup2(svg,rectWidth,rectHeight,spacing);

        // Adding the Images 
        for (let i = 0; i < Images.length; i++) {
          svg.append('image')
              //.attr('x',200+(i+1) *imagewidthAndHeight*2/3+ (i)* spacing)
              .attr('x',200+10+(i*2+1)* rectWidth+ (i+1) * spacing)
              .attr('y', 400+50+imagewidthAndHeight*4/3) // Align at the top
              .attr('width', imagewidthAndHeight)
              .attr('height', imagewidthAndHeight)
              .attr('href', Images[i]);
        }

        for (let i = 0; i < Images.length; i++) {

          svg.append('image')
              .attr('x', 20+(i%3) *rectWidth*2+ (i%3)* spacing)
              .attr('y', i<3? 550 : i<6?  550+imagewidthAndHeight+ 5 : 550+imagewidthAndHeight*2+ 5*2) // Align at the top
              .attr('width', imagewidthAndHeight)
              .attr('height', imagewidthAndHeight)
              .attr('href', Images[i]);

        }
        
        const startx = 20+3 *rectWidth*2+ 3* spacing +10;
        const starty = 550+imagewidthAndHeight *(3/2)+ 40;
        const midx = startx +150;
        const midy = starty;
        const endx = midx;
        const endy = midy -50;

        const pathData = `M ${startx} ${starty} L ${midx} ${midy}  L ${endx} ${endy}`;

        // Append the path to the SVG
        svg.append('path')
          .attr('d', pathData)
          .attr('stroke', 'black')
          .attr('stroke-width', 2)
          .attr('fill', 'none') // Make sure the path is not filled
          .attr('marker-end', 'url(#arrowhead)'); // Add an arrowhead marker
        
        const textx = 500;
        const texty =  520+imagewidthAndHeight *(3/2)+ 40 ;
        svg.append('text')
          .attr('x',textx)
          .attr('y',texty)
          .attr('text-anchor', 'middle') 
          .attr('dominant-baseline', 'middle')
          .text("Slice the image into patches")
        const text2x = 500;
        const text2y =  520+imagewidthAndHeight *(3/2)+ 40 +20 ;
          svg.append('text')
            .attr('x',text2x)
            .attr('y',text2y)
            .attr('text-anchor', 'middle') 
            .attr('dominant-baseline', 'middle')
            .text("In reality we have 14*14 patches per image")
        
        //display original images
        makeGroup3(svg,rectHeight);

        //FROM HERE WE DEFINE TRANSFORMER ENCODER 
        const encx = 80;
        const EncoderWidth = rectWidth *25+ (24)/2*spacing
        const EncoderHeight = 150;
        // Those 4 variables define how detailed architecture of the transformer block should look like 
        const archx = 730;
        const archy = 100;
        const archwidth = 180;
        const archheight = 400;
        /*
        DANGER ZONE - NOT SURE IF THIS IS THE RIGHT WAY TO DO 
        BLOCK ARCH CAN BE ALSO ASSIGNED AS 'BIBIBU' IF BLOCK IS NOT CLICKED  
        HOPEFULLY THIS IS UNKNOWN WHEN ITS NOT CLICKED 
        */ 
        const blockarch = makeEncoder(svg,encx,ency,EncoderWidth,EncoderHeight,archx,archy,archwidth,archheight);
        if (blockarch.node() instanceof SVGRectElement || blockarch.node() instanceof HTMLElement) {
          blockarch.on("click", function(this:any,event:any) {
          });
        }
    }
  }, [Images]); 
  

  useEffect(() => {
      const img_promises = images.map(image => getImage(folder_path + "..." + image));

          Promise.all(img_promises)
              .then((results) => {
                  // Filter out undefined results before setting the state
                  const filteredResults = results.filter((result): result is string => result !== undefined);
                  setImages(filteredResults);
              })
              .catch(console.error);

  }, [images, folder_path]); // The empty array causes this effect to only run on mount


  return (
    <div>
      {/* Create an SVG element for D3 to work with */}
      {/*The ref attribute attaches the d3Container ref to the SVG element, which allows D3 to directly access and manipulate this element.*/}
      <div style={{padding: "0px 0px 0px 40px"}} ref={d3Container}></div>
    </div>
  );

}

export default VisionTransformer;