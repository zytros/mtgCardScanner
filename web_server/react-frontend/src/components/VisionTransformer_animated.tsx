/*
Component for visualizing vision transformer architecture 
Steps to get libraries 
 npm install d3
 Maybe next time try - yarn add d3
*/ 
  
import React, { useEffect, useRef, useState, useCallback } from 'react';
import { getImage } from '../router/resources/data';
import * as d3 from 'd3';
import { Container } from 'react-dom';

function makeMLPHead(svg:any,ency:number){
  const g1 = svg.append('g')
        .attr('id', 'mlphead')
        .style('opacity', 0)
        // Moves the entire group 100px right and ency px down
        .attr('transform', 'translate(100, ' + ency.toString()+')');  
  
  g1.append('defs').append('marker')
  .attr('id', "arrowhead4head")
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

  const ecx = 50;
  const ecy = 0;
  const erx = 100;
  const ery = 40;

  const RectLeftMostCornerX = 250;
  const RectLeftMostCornerY = -25;
  const width = 100;
  const height = 50;
  const TextCenterX = RectLeftMostCornerX + width/2;
  const TextCenterY = RectLeftMostCornerY + height/2;

  // Class Output 
  g1.append('ellipse')
    .attr('cx', ecx) //center of ecllipse
    .attr('cy', ecy)
    //radius of ellipse 
    .attr('rx', erx) 
    .attr('ry', ery)
    .style('fill', 'none')
    .style('stroke', 'black');
  g1.append('text')
    .attr('x', ecx)
    .attr('y', ecy)
    // Center the text horizontally and vertically to the given x and y axis 
    .attr('text-anchor', 'middle')  
    .attr('dominant-baseline', 'middle')  
    .text('Persian Cat (0.9)');

  // MLP Head
  g1.append('rect')
    .attr('x', RectLeftMostCornerX) 
    .attr('y', RectLeftMostCornerY)
    .attr('width', width)
    .attr('height', height)
    .style('fill', 'none')
    .style('stroke', 'black');
  g1.append('text')
    .attr('x', TextCenterX)
    .attr('y', TextCenterY)
    .attr('text-anchor', 'middle')  
    .attr('dominant-baseline', 'middle')  
    .text('MLP Head');
  
  // Line between Eclipse and rectangle 
  const endX = ecx+erx+5;  // Right side of the ellipse (ellipse's cx + rx)
  const endY = ecy;   // center of ellipse
  const startX = RectLeftMostCornerX;   // Left side of the rectangle (rectangle's x)
  const startY = RectLeftMostCornerY+height/2;     // Vertical center of the rectangle (rectangle's y + height / 2)

  // line between Eclipse and rectangle 
  g1.append('line')
    .attr('x1', startX)
    .attr('y1', startY)    // End y: center y of rectangle
    .attr('x2', endX)  // Start x: right of ellipse
    .attr('y2', endY)  // Start y: center y of ellipse
    .attr('marker-end', 'url(#arrowhead4head)')
    .style('stroke', 'black')  // Color of the line
    .style('stroke-width', 2); // Thickness of the line
  // Line from Encoder to MLP Head 
  g1.append('line')
    .attr('x1', TextCenterX)
    .attr('y1', TextCenterY - height - 50)
    .attr('x2', TextCenterX)
    .attr('y2', RectLeftMostCornerY-5)
    .attr('marker-end', 'url(#arrowhead4head)')
    .style('stroke-width', 2)
    .style('stroke', 'black');
  
  // some informative text about the MLP head
  // add some informative text for the transformer encoder
  const xText = 400
  const textencoder = g1.append('text')
  .attr('x', xText)
  .attr('y', -50)
  .attr('font-family', 'sans-serif')
  .attr('font-size', '14px');

  const lines = [
      "A final Multi-Layer-Perceptron (MLP) will use the",
      "class token of the last transformer block to ", 
      "perform the final prediction of the model class ",
      "seen in the image. In our example, this will be the",
      "'Persian Cat' with a class probability of 0.9."
  ];

  lines.forEach((line, i) => {
    textencoder.append('tspan')
          .attr('x', xText)
          .attr('dy', '1.2em')
          .text(line);
})
};

function makePatchEmbeddingText(svg:any){
  const firstTextHeight = 140;
  const g1 = svg.append('g')
        // Moves the entire group 100px right and 100px down
        .attr('transform', 'translate(100, 100)')
        .attr('id', "patchembeddingtext")
        .style('opacity', 0)
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
    .text('class token');
}

function makeLinearProjection(svg:any, rectWidth:number,rectHeight:number,spacing:number){
      // Data for the rectangles
      const data = ["0", "*", "1","", "2","", "3","", "4","", "5","", "6","", "7","", "8","", "9",""];

      // Select the SVG container where you want to add the shapes
      const g2 = svg.append('g')
              .attr('id', 'linearProjection1')
              .style('opacity', 0)
              .attr('transform', 'translate(200, 100)');
      
      svg.append('defs').append('marker')
      .attr('id', "arrowhead4linproj")
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
      
      // Linear Projection Box short : lpb 
      // left most corner coordinate of this box is lpbx and lpby
      const lpbx = rectWidth*2+spacing
      const lpby = rectHeight*4
      //widht of the box depend son the rect 
      const lphbWidth = rectWidth *18+ (17)/2*spacing 
      const lphbHeight = 50
      g2.append('rect')
      .attr('id', 'linear-projection-text-rect')
      .attr('x', lpbx)
      .attr('y', lpby)
      .attr('width', lphbWidth)
      .attr('height',lphbHeight)
      .attr('rx',20)
      .attr('ry',20)
      .style('fill', '#6c1236')
      .style('stroke', 'black');

      g2.append('text')
      .attr('id', 'linear-projection-text')
      .attr('x', rectWidth*2+spacing + (rectWidth *18+ (17)/2*spacing)/2 )
      .attr('y', lpby +lphbHeight/2)
      .attr('text-anchor', 'middle') 
      .attr('dominant-baseline', 'middle')
      .attr("fill", "white")
      .text('Linear Projection of Flattened Patches');


      const g3 = svg.append('g')
              .attr('id', 'linearProjection2')
              .style('opacity', 0)
              .attr('transform', 'translate(200, 100)');
      // Create the rectangles of embeddings - not the pictures 
      g3.selectAll('rect')
          //One to one of element of data => Rectangle 
          .data(data)
          //enter is called on the selection to create a placeholder for each data item that does not already have an associated rect element on the page
          .enter()
          .append('rect')
          .attr('id', 'linear-projection-rects')
          //.attr('x', (d, i) => i * rectWidth) // Position based on the index
          .attr('x', (d:string, i:number) => i %2 === 0 ? i * rectWidth+ i/2 * spacing: rectWidth *i+(i-1)/2*spacing )
          .attr('y', lpby + lphbHeight*1.5) // Align at the top
          .attr('rx', 4) 
          .attr('ry', 4)
          .attr('width', rectWidth)
          .attr('height', rectHeight)
          .style('fill', (d:string, i:number) => i%2===0? '#6c1236' :"#d11761")
          .style('stroke', 'black');

      // Add text to the rectangles
      g3.selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('id', 'linear-projection-rects-numbers')
          .attr('x', (d:string, i:number) => i %2 ===0 ? i * rectWidth+ i/2 * spacing + rectWidth/2: rectWidth *i+(i-1)/2*spacing + rectWidth/2) 
          .attr('y', lpby + lphbHeight*1.5 + rectHeight / 2) // Center the text vertically
          .attr('text-anchor', 'middle') // Center the text horizontally
          .attr('dominant-baseline', 'middle') // Center the text vertically
          .attr("fill", "white")
          .text((d: any) => d);


      data.forEach((elem, i) => {
          for (let j = 0; j < data.length; j++) {
            if (j%2 ===0){
              // Arrows between patches and encoder
              g3.append('line')
                .attr('x1', j * rectWidth+ j/2 * spacing +1*rectWidth) 
                .attr('y1', lpby + lphbHeight*1.5 + rectHeight ) 
                .attr('x2', j * rectWidth+ j/2 * spacing +1*rectWidth) 
                .attr('y2', lpby + lphbHeight*1.5 + rectHeight*2) 
                .style('stroke', 'black')
                .style('stroke-width', 1)
                .attr('marker-end', 'url(#arrowhead4linproj)');
            }
            //line that goes from rectangles to linear projection layer 
            if (j%2 ===0 && j >1){
              g3.append('line')
                .attr('x1', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y1', lpby + lphbHeight) 
                .attr('x2', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y2', lpby + lphbHeight*1.5) 
                .style('stroke', 'black')
                .style('stroke-width', 1)
            }
            if (j%2 ===0 && j >1){
              //this is the line that goes from the linear projection layer to the square images 
              g2.append('line')
                .attr('x1', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                // from g2's origin + rectHeight + line that goes from linear projection layer +lphbHeight 
                .attr('y1', 3.4*rectHeight)
                .attr('x2', j * rectWidth+ j/2 * spacing +1/2*rectWidth) 
                .attr('y2', lpby) 
                .style('stroke', 'black')
                .style('stroke-width', 1);
              // ix , iy denote start coordinate of the image square 
              // it has to be square so width and height should be same. We call this "size" 
              var ix = j* rectWidth+ j/2 * spacing;
              const size = (3/2) * rectHeight
              
              // Text enumerating the images
              g2.append('text')
                .attr('x', ix+size/2-10) 
                // from g2's origin + rectHeight + line that goes from linear projection layer +lphbHeight 
                .attr('y', 50) 
                .attr('text-anchor', 'middle') 
                .attr('dominant-baseline', 'middle')
                .text(data[j]);
            }
          }
      })
}

function makeEncoder(svg:any,encx:number, ency:number,EncoderWidth:number ,EncoderHeight:number,archx:number,archy:number,archwidth:number,archheight:number, image_encoder:string){

      //const EncoderHeight;
      const g4 = svg.append('g').attr('id', 'encoder').style('opacity', 0)

      svg.append('defs').append('marker')
      .attr('id', "arrowhead4trans")
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
      

      g4.append('rect')
        .attr('x', encx)
        .attr('y', ency)
        .attr('width', EncoderWidth)
        .attr('height', EncoderHeight)
        .style('fill', '#3a0b97')
        .style('stroke', 'black')
        .attr("rx", 20)
        .attr("ry", 20)

      //Infotext height - click me 
      const infox = encx +EncoderWidth/4;
      const infoy = ency +EncoderHeight/2;
      g4.append('text')
        .attr('x',infox)
        .attr('y',infoy)
        .attr('text-anchor', 'middle') 
        .attr('dominant-baseline', 'middle') 
        .attr("font-weight",800)
        .attr("fill", "white")
        .text("Transformer Encoder")

      const block1x = encx+(0.55) *EncoderWidth;
      const block1y = ency+EncoderHeight/10;
      const blockwidth = (0.4)*EncoderWidth;
      const blockheight = EncoderHeight/4;
      
     
      
      // transfromer block1 
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

        const g5 = svg.append('g').attr('id', 'transformerblock1arch').style("opacity", 0)
        g5.append('rect')
        .attr('x', archx)
        .attr('y', archy)
        .attr('width', archwidth)
        .attr('height', archheight)
        .style('fill', 'none')
        .style('stroke', '#af8df3')
        .attr("rx", 10)
        .attr("ry", 10)
        .style("pointer-events","visible");

        g5.append('text')
        .attr('x', archx+10)
        .attr('y', archy-8)
        .attr("font-weight",700)
        .attr("fill", "#3a0b97")
        .text('Structure of a block');

        //Encoder to block connection
        g5.append('path')
        .attr('d', `M ${encx + EncoderWidth} ${ency+25}  L ${encx+EncoderWidth} ${ency+EncoderHeight-25} L ${archx} ${archy+archheight-6} L ${archx} ${archy+6} Z`)
        .style('fill', '#af8df3')
        .style('stroke', '#af8df3');
        
        g5.append('image')
        .attr('x',archx+10)
        .attr('y', archy-5)
        .attr('width', archwidth-20)
        .attr('height', archheight+10)
        .attr('href', image_encoder)
        
        // add some informative text for the transformer encoder
        const lines = [
          "The transformer encoder contains transformer blocks which consist of Multi-Head Attention, a Fully", 
          "Connected Layer and Layer Normalization Layers. The ViT-base model has k=12 of such blocks.",
          "The embeddings are passed to the first transformer block which processes it and passes the output",
          "further to the next transformer block. Except for the first transformer block, each block receives",
          "the output of the preceding block as its input."
      ];
        const textencoder = g5.append('text')
        .attr('x', encx)
        .attr('y', ency-lines.length*20-10)
        .attr('font-family', 'sans-serif')
        .attr('font-size', '14px');

        lines.forEach((line, i) => {
          textencoder.append('tspan')
                .attr('x', encx)
                .attr('dy', '1.2em')
                .text(line);
    });
}

interface UseInViewOptions {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
}

function useInView(options: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const setRef = useCallback((node: Element | null) => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
    }, options);

    if (node) observerRef.current.observe(node);
  }, [options]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return [setRef, isInView] as [typeof setRef, boolean];
}

interface Props {
  folder_path: string;
  images: string[];
  encoder_block: string;
}

const VisionTransformerAnimated: React.FC<Props> = ({folder_path, images, encoder_block})=> {
  const d3Container = useRef<SVGSVGElement>(null);
  const animationControl = useRef({ initialized: false });
  const [ref, inView] = useInView({ threshold: 0.0 });
  const svg = useRef({stet: d3.select(d3Container.current)
    .append('svg')
    .attr('width', 1000)
    .attr('height', 750)});
  const embeddingRendered = useRef({ initialized: false });
  const encoderRendered = useRef({ initialized: false });
  const classPredictionRendered = useRef({ initialized: false });

  // create svg objects in a function to be called later
  const initializeSVG = (images: string[], image_encoder:string) => {
    if (d3Container.current){
      svg.current.stet = d3.select(d3Container.current)
          .append('svg')
          .attr('width', 1000)
          .attr('height', 750);
    }
    const rectWidth = 20; 
    const rectHeight = 30; 
    const spacing = 10;
    const imagewidthAndHeight = (3/2) *rectHeight
    const startx = 20+3*rectWidth*2+ 3* spacing +10;
    const starty = imagewidthAndHeight * (3/2);
    const midx = startx +150;
    const midy = starty;
    const endx = midx;
    const endy = midy +50;
    const encx = 80;
    const ency = 360;
    const EncoderWidth = rectWidth *25+ (24)/2*spacing
    const EncoderHeight = 150;
    // Those 4 variables define how detailed architecture of the transformer block should look like 
    const archx = 730;
    const archy = 200;
    const archwidth = 180;
    const archheight = 400;

    const pathData = `M ${startx} ${starty} L ${midx} ${midy}  L ${endx} ${endy}`;
    for (let i = 0; i < images.length; i++) {
      // Images sliced in one row
      svg.current.stet.append('image')
      .attr('id', 'image-sliced-'+ i.toString())
      //.attr('x',200+(i+1) *imagewidthAndHeight*2/3+ (i)* spacing)
      .attr('x',200+10+(i*2+1)* rectWidth+ (i+1) * spacing)
      .attr('y', imagewidthAndHeight*3.5) //400+50+imagewidthAndHeight*4/3) // Align at the top
      .attr('width', imagewidthAndHeight)
      .attr('height', imagewidthAndHeight)
      .attr('href', images[i])
      .style('opacity', 0);

      // images sliced in 3 rows
      svg.current.stet.append('image')
      .attr('id', 'image-3-rows-'+i.toString())
      .attr('x', 20+(i%3) *rectWidth*2+ (i%3)* spacing)
      .attr('y', i<3? 0 : i<6?  imagewidthAndHeight+ 5 : imagewidthAndHeight*2+ 5*2) // Align at the top
      .attr('width', imagewidthAndHeight)
      .attr('height', imagewidthAndHeight)
      .attr('href', images[i])
      .style('opacity', 1);
    }
    

    // Paths between images
    svg.current.stet.append('path')
    .attr('id', 'path-between-images')
    .attr('d', pathData)
    .attr('stroke', 'black')
    .attr('stroke-width', 2)
    .attr('fill', 'none') // Make sure the path is not filled
    .attr('marker-end', 'url(#arrowhead4patches)') // Add an arrowhead marker
    .style('opacity', 0);
    
    // Add text for the patches
    const textx = 500;
    const texty =  imagewidthAndHeight *(3/2) ;
    svg.current.stet.append('text')
    .attr('id', 'text-patches-1')
    .attr('x',textx)
    .attr('y',texty)
    .attr('text-anchor', 'middle') 
    .attr('dominant-baseline', 'middle')
    .text("Slice the image into patches")
    .style('opacity', 0);
    const text2x = 500;
    const text2y =  imagewidthAndHeight *(3/2)+ 20 ;
    svg.current.stet.append('text')
      .attr('id', 'text-patches-2')
      .attr('x',text2x)
      .attr('y',text2y)
      .attr('text-anchor', 'middle') 
      .attr('dominant-baseline', 'middle')
      .text("In reality we have 14*14 patches per image")
      .style('opacity', 0);

    //Helpfer function for creating marker
    svg.current.stet.append('defs').append('marker')
      .attr('id', "arrowhead4patches")
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


      // render the other blocks without displaying them
      if (!embeddingRendered.current.initialized){
        embeddingRendered.current.initialized = true;
        // make Patch Embedding Text description
        makePatchEmbeddingText(svg.current.stet);
        // make the flattened patches embedding D3 group
        makeLinearProjection(svg.current.stet,rectWidth,rectHeight,spacing);
      }

      if (!encoderRendered.current.initialized){
        encoderRendered.current.initialized = true
        /*
        DANGER ZONE - NOT SURE IF THIS IS THE RIGHT WAY TO DO 
        BLOCK ARCH CAN BE ALSO ASSIGNED AS 'BIBIBU' IF BLOCK IS NOT CLICKED  
        HOPEFULLY THIS IS UNKNOWN WHEN ITS NOT CLICKED 
        */ 
        makeEncoder(svg.current.stet,encx,ency,EncoderWidth,EncoderHeight,archx,archy,archwidth,archheight,image_encoder);
      }

      if (!classPredictionRendered.current.initialized){
        classPredictionRendered.current.initialized = true;
        makeMLPHead(svg.current.stet, ency+EncoderHeight+100);
      }
  }
  // fetch images
  useEffect(() => {
    const all_images: string[] = images.concat([encoder_block])
    const img_promises = all_images.map(image => getImage(folder_path + "..." + image));
    Promise.all(img_promises).then((results) => {
        const filteredResults = results.filter((result): result is string => result !== undefined);
        const images_input = filteredResults.slice(0, images.length);
        const image_encoder = filteredResults[filteredResults.length-1];
        initializeSVG(images_input, image_encoder);
        animationControl.current.initialized = true;
    }).catch(console.error);
  }, [images, folder_path, encoder_block]);

  // animation
  // handle scroll
  const handleScroll = useCallback(() => {
    const d3cont = d3Container.current
    if (!d3cont) return;
    const bbox = d3cont.getBoundingClientRect();
    const relativeTop = window.scrollY + bbox.top;
    const height = bbox.height; // should be something about 750
    const scrollY = window.scrollY;
    // Those 4 variables define how detailed architecture of the transformer block should look like 

    let scrollPercentage = 0;
    if (scrollY > relativeTop-500) { // 400 means that the when the top is 400px away from the screen top, we start the animation
        scrollPercentage = Math.min(((scrollY - relativeTop + 500) / height), 1);
    }

    // Apply dynamic opacity based on the scroll position
    if (scrollPercentage < 0.05){
      const opacity_value = scrollPercentage / 0.05
      svg.current.stet.select('#path-between-images')
      .style('opacity', opacity_value);
      svg.current.stet.select('#text-patches-1')
      .style('opacity', opacity_value);
      svg.current.stet.select('#path-between-images')
      .style('opacity', opacity_value);
      svg.current.stet.select('#text-patches-2')
      .style('opacity', 0);
      for (let i = 0; i < 9; i++) {
        svg.current.stet.select('#image-sliced-'+i.toString())
        .style('opacity', 0);
      }
    }

    if (scrollPercentage > 0.1){
      const opacity_value = (scrollPercentage-0.1)/0.05
      const opacity_value_deteriorating = Math.max(1-opacity_value, 0)
      for (let i = 0; i < 9; i++) {
        svg.current.stet.select('#image-3-rows-'+i.toString())
        .style('opacity', opacity_value_deteriorating);
        svg.current.stet.select('#image-sliced-'+i.toString())
        .style('opacity', opacity_value);
      }
      svg.current.stet.select('#text-patches-2')
      .style('opacity', opacity_value);

      svg.current.stet.select('#text-patches-1')
      .style('opacity', opacity_value_deteriorating);
      svg.current.stet.select('#path-between-images')
      .style('opacity', opacity_value_deteriorating);
      svg.current.stet.select('#linearProjection1')
      .style('opacity', 0);
      
    }
    if (scrollPercentage > 0.18){
      const opacity = Math.min((scrollPercentage-0.18)/0.05, 1)
      svg.current.stet.select('#linearProjection1')
      .style('opacity', opacity);

      const opacity_value_deteriorating = 1-opacity
      svg.current.stet.select('#text-patches-2')
      .style('opacity', opacity_value_deteriorating);
      svg.current.stet.select('#linearProjection2')
      .style('opacity', 0);
      svg.current.stet.select('#patchembeddingtext')
      .style('opacity', 0);
      
    }
    if (scrollPercentage > 0.26 && embeddingRendered.current.initialized){
      const opacity = Math.min((scrollPercentage-0.26)/0.05, 1)
      svg.current.stet.select('#linearProjection2')
      .style('opacity', opacity);
      svg.current.stet.select('#patchembeddingtext')
      .style('opacity', opacity);
    }
    if (scrollPercentage > 0.32 && encoderRendered.current.initialized){
      const opacity = Math.min((scrollPercentage-0.32)/0.05, 1)
      svg.current.stet.select('#encoder')
      .style('opacity', opacity);
    }
    else if (encoderRendered.current.initialized){
        svg.current.stet.select('#encoder')
      .style('opacity', 0);
      }

    if (scrollPercentage > 0.43 && encoderRendered.current.initialized){
      const opacity = Math.min((scrollPercentage-0.43)/0.05, 1)
      const opacity_deterioraing = Math.max(0, 1-opacity)
      svg.current.stet.select('#transformerblock1arch')
      .style('opacity', opacity)
      svg.current.stet.select('#linearProjection2')
      .style('opacity', opacity_deterioraing);
      svg.current.stet.select('#patchembeddingtext')
      .style('opacity', opacity_deterioraing);
      for (let i = 0; i < 9; i++) {
        svg.current.stet.select('#image-sliced-'+i.toString())
        .style('opacity', opacity_deterioraing);
      }
      svg.current.stet.select('#linearProjection1')
      .style('opacity', opacity_deterioraing);
    }
    else if (encoderRendered.current.initialized){
      svg.current.stet.select('#transformerblock1arch')
      .style('opacity', 0)
    }
    
    if (scrollPercentage > 0.51){
      const opacity = Math.max(Math.min((scrollPercentage-0.51)/0.05, 1), 0)
      const opacity_deterioraing = Math.max(0, 1-opacity)
      if (classPredictionRendered.current.initialized){
        svg.current.stet.select('#mlphead')
        .style('opacity', opacity)
      }
      if (encoderRendered.current.initialized){
        svg.current.stet.select('#transformerblock1arch')
        .style('opacity', opacity_deterioraing)
      }
    }
    else if (classPredictionRendered.current.initialized){
        svg.current.stet.select('#mlphead')
        .style('opacity', 0)
    }
    if (scrollPercentage > 0.57){ // display complete architecture
      const opacity = Math.min((scrollPercentage-0.57)/0.05, 1)
      svg.current.stet.select('#path-between-images')
      .style('opacity', opacity);
      svg.current.stet.select('#text-patches-1')
      .style('opacity', opacity);
      svg.current.stet.select('#path-between-images')
      .style('opacity', opacity);
      svg.current.stet.select('#text-patches-2')
      .style('opacity', opacity);
      svg.current.stet.select('#linearProjection1')
      .style('opacity', opacity)
      svg.current.stet.select('#linearProjection2')
      .style('opacity', opacity);
      svg.current.stet.select('#patchembeddingtext')
      .style('opacity', opacity);
      for (let i = 0; i < 9; i++) {
        svg.current.stet.select('#image-sliced-'+i.toString())
        .style('opacity', opacity);
        svg.current.stet.select('#image-3-rows-'+i.toString())
        .style('opacity', opacity);
      }
    }
}
  , []);
  
  useEffect(() => {
    if (inView) {
        window.addEventListener('scroll', handleScroll);
    } else {
        window.removeEventListener('scroll', handleScroll);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll, inView]);

 

  return (
    <div>
        <div ref={ref} style={{ padding: "40px 40px 0px 40px" }}>
            <svg ref={d3Container} style={{width: 1000, height: 750, padding: "0px 40px 0px 40px", position: "sticky"}} />
        </div>
    </div>
);

}

export default VisionTransformerAnimated;