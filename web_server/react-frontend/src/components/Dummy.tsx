/*
Component for visualizing vision transformer architecture 
Steps to get libraries 
 npm install d3
 Maybe next time try - yarn add d3
*/ 
  
import React, { useEffect, useRef } from 'react';
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
    .attr('x2', startX)  // Start x: right of ellipse
    .attr('y2', startY)  // Start y: center y of ellipse
    .attr('marker-end', 'url(#arrowhead)')
    .style('stroke', 'black')  // Color of the line
    .style('stroke-width', 2); // Thickness of the line
  // Line from Encoder to MLP Head 
  g1.append('line')
    .attr('x1', TextCenterX)
    .attr('y1', ency-120)
    .attr('x2', TextCenterX)
    .attr('y2', TextCenterY +height/2)
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
    .text('Patch+Position');
  g1.append('text')
    .attr('x',0)
    .attr('y',firstTextHeight+20)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle') 
    .attr("font-weight",700)
    .text('Embedding');
  g1.append('text')
    .attr('x',0)
    .attr('y',firstTextHeight+20*2)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle') 
    .attr("font-weight",500)
    .text('(*) is extra learnable');
  g1.append('text')
    .attr('x',0)
    .attr('y',firstTextHeight+20*3)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle') 
    .attr("font-weight",500)
    .text('[class] embedding');
};

function makeGroup2(svg:any, rectWidth:number,rectHeight:number,spacing:number){
      

      // Data for the rectangles
      const data = ["0", "*", "1","", "2","", "3","", "4","", "5","", "6","", "7","", "8","", "9",""];

      // Select the SVG container where you want to add the shapes

      const g2 = svg.append('g')
              .attr('transform', 'translate(200, 400)');  
     
      // Create the rectangles
      g2.selectAll('rect')
          //One to one of element of data => Rectangle 
          .data(data)
          //enter is called on the selection to create a placeholder for each data item that does not already have an associated rect element on the page
          .enter()
          .append('rect')
          //.attr('x', (d, i) => i * rectWidth) // Position based on the index
          .attr('x', (d:string, i:number) => i %2 ==0 ? i * rectWidth+ i/2 * spacing: rectWidth *i+(i-1)/2*spacing )
          .attr('y', 0) // Align at the top
          .attr('rx', 4) 
          .attr('ry', 4)
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .style('fill', (d:string, i:number) => i%2==0? 'lavender' :'rgb(252,225,224)')
          .style('stroke', 'black');
      
      // Add text to the rectangles
      g2.selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('x', (d:string, i:number) => i %2 ==0 ? i * rectWidth+ i/2 * spacing + rectWidth/2: rectWidth *i+(i-1)/2*spacing + rectWidth/2) 
          .attr('y', rectHeight / 2) // Center the text vertically
          .attr('text-anchor', 'middle') // Center the text horizontally
          .attr('dominant-baseline', 'middle') // Center the text vertically
          .text((d: any) => d);

      data.forEach((elem, i) => {
          // For each pair, create oneline 
          for (let j = 0; j < data.length; j++) {
            if (j%2 ==0){
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
            if (j%2 ==0 && j >1){
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
        .style('fill', 'rgb(252,225,224)')
        .style('stroke', 'black');
      ;

      g2.append('text')
        .attr('x', rectWidth*2+spacing + (rectWidth *18+ (17)/2*spacing)/2 )
        .attr('y', lpby +lphbHeight/2)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle')
        .text('Linear Projection of Flattened Patches');
          
      data.forEach((elem, i) => {
          // For each pair, create oneline 
          for (let j = 0; j < data.length; j++) {
            if (j%2 ==0 && j >1){
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
              g2.append('rect')
                .attr('x', ix) 
                // from g2's origin + rectHeight + line that goes from linear projection layer +lphbHeight 
                .attr('y', iy ) 
                .attr('width', size)
                .attr('height',size)
                .style('fill', 'none')
                .style('stroke', 'black'); 

              g2.append('text')
                .attr('x', ix+size/2) 
                // from g2's origin + rectHeight + line that goes from linear projection layer +lphbHeight 
                .attr('y', iy+size/2) 
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
        .style('fill', 'rgb(255,205,154)')
        .style('stroke', 'black')
        .attr("rx", 20)
        .attr("ry", 20)

      g4.append('text')
        .attr('x', 105)
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
        .text("Click on the first transformer block")
      g4.append('text')
        .attr('x',infox)
        .attr('y',infoy +20)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle') 
        .attr("font-weight",700)
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
        .style('stroke', 'black')
        .attr("rx", 10)
        .attr("ry", 10)
        .style("pointer-events","visible")
        .on("mouseover", function(this:any,event:any) {
          // handle events here
            // d - datum
            // i - identifier or index
            // this - the `<rect>` that was clicked
          d3.select(this).style('fill', 'rgb(247,151,65)');
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
        .text("Transformer block 1");
      //Dot dot dot 
      g4.append('circle')
        .attr('cx',block1x +blockwidth/2)
        .attr('cy',block1y +blockheight+12)
        .attr('r',2)
        .attr('stroke', 'black')
        .attr('fill', 'black');
      g4.append('circle')
        .attr('cx',block1x +blockwidth/2)
        .attr('cy',block1y +blockheight+24)
        .attr('r',2)
        .attr('stroke', 'black')
        .attr('fill', 'black');
      g4.append('circle')
        .attr('cx',block1x +blockwidth/2)
        .attr('cy',block1y +blockheight+36)
        .attr('r',2)
        .attr('stroke', 'black')
        .attr('fill', 'black');
      const block2x = encx+(0.55) *EncoderWidth;
      const block2y = block1y+blockheight+48;
      g4.append('rect')
        .attr('x', block2x)
        .attr('y', block2y)
        .attr('width', blockwidth)
        .attr('height', blockheight)
        .style('fill', 'none')
        .style('stroke', 'black')
        .attr("rx", 10)
        .attr("ry", 10)
      g4.append('text')
        .attr('x',block2x +blockwidth/2)
        .attr('y',block2y +blockheight/2)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle') 
        .text("Transformer block k");
      
      /*
      DANGER ZONE - NOT SURE IF THIS IS THE RIGHT WAY TO DO 
      BLOCK ARCH CAN BE ALSO ASSIGNED AS 'BIBIBU' IF BLOCK IS NOT CLICKED  
      HOPEFULLY THIS IS UNKNOWN WHEN ITS NOT CLICKED 
      */ 
      const spacing = 20;
      var blockarch:d3.Selection<SVGRectElement, unknown, HTMLElement, any> =d3.select('BIBIBU');
      block.on("click", function(this:any,event:any) {
           

          //TODO add lines - maybe they can be fancy transitions 
      });
      if (blockarch){return blockarch;}
      else{return blockarch;}

}
export default function VisionTransformer() {
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
    if (d3Container.current) {
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
      
      //make nput processing pipeline 
      makeGroup2(svg,rectWidth,rectHeight,spacing);
      
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
        const g5 = svg.append('g');
        blockarch.on("click", function(this:any,event:any) {
        });
      }
      

    }
    /*
      // Patch + Position Embedding text and class token
      svg.append('text')
      .attr('x', 10)
      .attr('y', 345)
      .text('Patch + Position Embedding');

      svg.append('circle')
      .attr('cx', 50)
      .attr('cy', 345)
      .attr('r', 10)
      .style('fill', 'black');

      svg.append('text')
      .attr('x', 60)
      .attr('y', 350)
      .text('0#');
      */
  }, []); // The empty array causes this effect to only run on mount

  return (
    <div>
      {/* Create an SVG element for D3 to work with */}
      {/*The ref attribute attaches the d3Container ref to the SVG element, which allows D3 to directly access and manipulate this element.*/}
      <div ref={d3Container}></div>
    </div>
  );
}


