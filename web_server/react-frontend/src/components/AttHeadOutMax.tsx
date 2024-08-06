import React, { useEffect, useRef, useState} from 'react';
import { getImage } from '../router/resources/data';
import * as d3 from 'd3';
import './Drawings.css';
import './TextStyles.css';

interface Attheadargs {
    folder_path: string;
    prefix: string;
    suffix: string; 
    range_num_heads: number;
    range_num_block: number
}

const AttHeadOutMax: React.FC<Attheadargs> = ({folder_path, prefix, suffix, range_num_heads, range_num_block}) => {

    const ref = useRef<HTMLDivElement>(null);
    const [images, setImages] = useState<string[]>([]);

    const imageSize = 50; // Size of the image normally
    const padding = 5; // Padding between images
    const arrowWidth = 30; // Width of the arrow

    useEffect(() => {
        const imageURLs: string[] = [];
        for (let col = 0; col < range_num_block; col++){
            for (let row = 0; row < range_num_heads; row++) {
                imageURLs.push(`${folder_path}...${prefix}${col}${suffix}${row}`);
            }
        }
        const img_promises = imageURLs.map(image => getImage(image));

        Promise.all(img_promises)

            .then((results) => {
                // Filter out undefined results before setting the state
                const filteredResults = results.filter((result): result is string => result !== undefined);
                setImages(filteredResults);
            })
            .catch(console.error);
    }, [folder_path, prefix, suffix, range_num_heads, range_num_block])



    // useEffect(() => {
    //     const imageURLs: string[] = [];
    //     for (let col = 0; col < range_num_block; col++){
    //         for (let row = 0; row < range_num_heads; row++) {
    //             imageURLs.push(`${folder_path}...${prefix}${col}${suffix}${row}`);
    //         }
    //     }
    //     const img_promises = imageURLs.map(image => getImage(image));

    //     Promise.all(img_promises)
    //         .then((results) => {
    //             // Filter out undefined results before setting the state
    //             const filteredResults = results.filter((result): result is string => result !== undefined);
    //             setImages(filteredResults);
    //         })
    //         .catch(console.error);
    // }, [folder_path, prefix, suffix, range_num_heads, range_num_block])

    useEffect(() => {
        // for (let idx = 0; idx <range_num_block*range_num_heads; idx++){
        //     const imagepath = imageURLs[idx];
        //     getImage(imagepath).then((imageData) => {
        //         if (imageData) {
        //             images.push(imageData);
        //         }
        //         else {
        //             console.error(`Error fetching Image in Component AttHeadOutMax ${imagepath}, image data is undefined`);
        //             images.push("");
        //         }
        //     }).catch(error => {
        //         console.error(`Error fetching Image in Component AttHeadOutMax ${imagepath} with message: ${error}`);
        //         images.push("");
        //     });
        // }
        
        if (ref.current && images.length > 0){
            
            const svg = d3.select(ref.current)
                .append('svg')
                .attr('width', (imageSize + padding + 11) * range_num_block + arrowWidth * (range_num_block - 1)) // Include space for arrows
                .attr('height', (imageSize + padding+ 10) * range_num_heads)
                .style('align-items', 'center')
                .style('justify-content', 'center');
            
            // Defining the shadow filter
            svg.append('defs')
                .append('filter')
                .attr('id', 'shadow')
                .append('feDropShadow')
                .attr('dx', '5')
                .attr('dy', '5')
                .attr('stdDeviation', '2');
            
            // iterate over the images and add them to the svg in a grid
            svg.selectAll('image')
                .data(images)
                .enter()
                .append('image')
                .attr('xlink:href', d => d)
                .attr('x', (_, i) => imageSize + Math.floor(i / range_num_heads) * (imageSize + padding + arrowWidth) + imageSize*2/3) // Position images with arrow spacing
                .attr('y', (_, i) => imageSize + (i % range_num_heads) * (imageSize + padding) - 0.5*imageSize)
                .attr('width', imageSize)
                .attr('height', imageSize)
                .style('transition', 'all 0.3s ease')
                .on('mouseover', function () {
                    d3.select(this)
                    // .attr('class', 'enlargedimage')
                    .raise()
                    .style('translate', `-${imageSize/2}px -${imageSize/2}px`)
                    .attr('width', imageSize*2)
                    .attr('height', imageSize*2)
                    .style('filter', 'url(#shadow)')
                })
                .on('mouseout', function () {
                    d3.select(this)
                    // .attr('class', 'smallimage')
                    .style('translate', `0px 0px`)
                    .attr('width', imageSize)
                    .attr('height', imageSize)
                    .style('filter', 'none')
                });
            
            // Draw right arrows at the middle of each column
            // triangle thingies
            svg.append('defs').append('marker')
                .attr('id', 'arrowhead_small')
                .attr('viewBox', '0 -5 10 10') // Coordinates to view the whole marker
                .attr('refX', 5) // Position along the path where the marker is placed
                .attr('refY', 0)
                .attr('markerWidth', 4) // Scale of the marker
                .attr('markerHeight', 4)
                .attr('orient', 'auto') // Align the marker with the path direction
                .append('path')
                .attr('d', 'M0,-5L10,0L0,5') // Path of the arrowhead
                .attr('fill', '#10277a');
            // Draw the line for the arrows and position the arrow head (triangle thingy)
            images.forEach((_, index) => {
                if (index % range_num_heads === range_num_heads / 2 && index / range_num_heads < range_num_block - 1) {
                    const colIndex = Math.floor(index / range_num_heads);
                    const yPosition = imageSize + range_num_heads / 2 * (imageSize + padding) - 0.5*padding - 0.5*imageSize;
                    const xPosition = 1.5 * imageSize + (colIndex + 1) * (imageSize + padding) + colIndex * (arrowWidth) + 2*padding;
                    svg.append('path')
                        .attr('d', `M${xPosition} ${yPosition} l${arrowWidth-2*padding} 0`)
                        .attr('stroke', '#10277a')
                        .attr('stroke-width', 3)
                        .attr('marker-end', 'url(#arrowhead_small)');
                    }
            });
            
            // Add bottom axis label
            svg.append('text')
                .attr('x', imageSize + (imageSize + padding + arrowWidth) * range_num_block / 2)
                .attr('y', (imageSize + padding) * range_num_heads + 1.8 * imageSize)
                .text('Increasing Network Depth - 12 Transformer Blocks')
                .classed('axis-label', true);

            // Calculate the starting X position for the path
            const startX = imageSize + arrowWidth;
            const startY = (imageSize + padding) * range_num_heads + 1.2 * imageSize - 0.2*imageSize;
            const endX = startX + (imageSize + padding + arrowWidth) * range_num_block - padding - arrowWidth;
            // Draw the line using a path element
            svg.append('path')
                .attr('d', `M${startX} ${startY} L${endX} ${startY}`) // Draw a line from startX to endX at startY height
                .attr('stroke', '#10277a')
                .attr('stroke-width', 3)
                .attr('marker-end', 'url(#arrowhead_small)'); // Attach the arrowhead marker

            // Add left axis label
            const leftLabelHeight = (imageSize + padding) * range_num_heads / 2 + imageSize;
            svg.append('text')
                .attr('transform', `rotate(-90,10,${leftLabelHeight})`)
                .attr('x', 0)
                .attr('y', leftLabelHeight + imageSize) // kind of turns to x after rotation
                .classed('axis-label', true)
                .text('12 Attention Heads');

            // svg.append('path')
            //     .attr('d', `M30,${2*imageSize} q0,${leftLabelHeight - imageSize}, ${-20},${leftLabelHeight - imageSize}`)
            //     .attr('stroke', '#10277a')
            //     .attr('strokeWidth', '5')
            //     .attr('fill', 'none')
            //     .attr('stroke', 'black')
            //     .attr('fill', 'none');
        
        }
        return () => { d3.select(ref.current).select('svg').remove(); }; // Cleanup SVG to prevent duplicates
    }, [images]);
            

    return <div ref={ref} />;
};

export default AttHeadOutMax;