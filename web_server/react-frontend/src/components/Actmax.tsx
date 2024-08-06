import React, { useEffect, useState} from 'react';
import { getImage } from '../router/resources/data';
import './Drawings.css';
import * as d3 from 'd3';

interface Props {
    folder_path: string;
    images: string[];
}

interface ImgDisplayProps {
    neuron: string;          // The identifier for the neuron
    isHovered:Boolean;
    Images: string[];        // Array of image URLs
    x:number |undefined;
    y:number|undefined;
}

const ImgDisplay: React.FC<ImgDisplayProps> = ({ neuron, isHovered, Images,x,y}) => {
    const imagestroke = "#465bec";
    return (
        /*
        <div style={{ visibility: displayN === neuron ? 'hidden' : 'visible' }}>
            <img src = {Images[parseInt(neuron, 10)]}/>
        </div>*/
        <>
        {isHovered &&  (
            <>
            <image href= {Images[parseInt(neuron, 10)]} x={(x ?? 0)+ 10 } y={(y ?? 0)- 180} height="150px" width="150px"/>
            <rect x={(x ?? 0) + 10} y={(y ?? 0)-180} height="150px" width="150px" fill="none" stroke={imagestroke} strokeWidth="5"/>
    
            </>
        )}
        </>
    );
};



const ActMax: React.FC<Props> = ({folder_path, images }) => {
    const [Images, setImages] = useState<string[]>([]);
    const [displayN, setDisplayN] = useState<string | undefined>("");
    const [cx,setCx] = useState<number|undefined>(0);
    const [cy,setCy] = useState<number|undefined>(0);
    const [isHovered, setIsHovered] = useState(false);
    type Pos = {
        [key: string]: [number, number];
    };
    
   
     const handleMouseOver = (neuron: string) => {
        console.log(`Node ${neuron} mouseOver`);
        /*
        const n = d3.select("svg_30");
        n.style("fill" , "#fff");
        */
        setDisplayN(neuron);
        setIsHovered(true);
        setCx(pos[neuron][1]+7);
        setCy(pos[neuron][0]+7);


    };

    
    const handleMouseOut = () => {
        setIsHovered(false);
    };

    const cry = 25;
    const crx = 25;
    
    const circlefill = "#3a0b97";
    const hoverfill = "#465bec";
    const rectfill = "#facea0";
    const circleStroke = "#3a0b97";
    const rectstroke = "#facea0";
    const encoderx = 100;
    const encodery = 100;
    const encwidth = 750;
    const encheight = 470;
    // big block configuration
    const bigblocky = 160;
    const bigblockwidth =70;
    const bigblockheight=380;
    const cxBlock1 = encoderx+80;
    const xBlock1 = cxBlock1-bigblockwidth/2;
    const cxBlock2 =  cxBlock1+290;
    const xBlock2 = cxBlock2-bigblockwidth/2;
    const cxBlock3 =  cxBlock2+235;
    const xBlock3 = cxBlock3-bigblockwidth/2;
    const cxBlock4 = cxBlock3+210;
    const xBlock4 = cxBlock4-bigblockwidth/2;
    const circleystart = 200;
    // small block configuration
    const smallblocky =255;
    const smallwidth  =28;
    const smallheight  =200;
    const offsetSmallBlocks = 20;
    const xOfFirstSmallBlock = xBlock1 +bigblockwidth +offsetSmallBlocks;
    const xSecondSmall =xOfFirstSmallBlock+smallwidth+offsetSmallBlocks;
    const xthirdSmall = xOfFirstSmallBlock+smallwidth*2+offsetSmallBlocks*2;
    const xfourthSmall = xOfFirstSmallBlock+smallwidth*3+offsetSmallBlocks*3;
    const xSixSmall = xBlock2+bigblockwidth+offsetSmallBlocks;
    const xSevenSmall = xSixSmall+smallwidth+offsetSmallBlocks;
    const xEightSmall = xSixSmall+smallwidth*2+offsetSmallBlocks*2;
    const xtenSmall = xBlock3+bigblockwidth+offsetSmallBlocks;
    const xElevenSmall = xtenSmall+smallwidth +offsetSmallBlocks;




    const pos:Pos = {
        "0": [circleystart, cxBlock1],
        "1": [circleystart+cry*3, cxBlock1],
        "2": [circleystart+cry*3*2, cxBlock1],
        "3": [circleystart+cry*3*3, cxBlock1],
        "4": [circleystart+cry*3*4, cxBlock1],
        "5": [circleystart, cxBlock2],
        "6": [circleystart+cry*3, cxBlock2],
        "7": [circleystart+cry*3*2, cxBlock2],
        "8": [circleystart+cry*3*3, cxBlock2],
        "9": [circleystart+cry*3*4, cxBlock2],
        "10": [circleystart, cxBlock3],
        "11": [circleystart+cry*3,cxBlock3],
        "12": [circleystart+cry*3*2, cxBlock3],
        "13": [circleystart+cry*3*3, cxBlock3],
        "14": [circleystart+cry*3*4, cxBlock3],
        "15": [circleystart, cxBlock4],
        "16": [circleystart+cry*3,cxBlock4],
        "17": [circleystart+cry*3*2, cxBlock4],
        "18": [circleystart+cry*3*3, cxBlock4],
        "19": [circleystart+cry*3*4, cxBlock4]
    };
    const arrowy =smallblocky+smallheight/2
    const path1 =`M${xBlock1 +bigblockwidth},${arrowy} L${xOfFirstSmallBlock-8},${arrowy}`
    const path2 =`M${xOfFirstSmallBlock+smallwidth},${arrowy} L${xSecondSmall-8},${arrowy}`
    const path3 =`M${xSecondSmall+smallwidth},${arrowy} L${xthirdSmall-8},${arrowy}`
    const path4 =`M${xthirdSmall+smallwidth},${arrowy} L${xfourthSmall-8},${arrowy}`
    const path5 =`M${xfourthSmall+smallwidth},${arrowy} L${xBlock2-8},${arrowy}`
    const path6 = `M${xBlock2+bigblockwidth},${arrowy} L${xSixSmall-8},${arrowy}`
    const path7 =`M${xSixSmall+smallwidth},${arrowy} L${xSevenSmall-8},${arrowy}`
    const path8=`M${xSevenSmall+smallwidth},${arrowy} L${xEightSmall-8},${arrowy}`
    const path9=`M${xEightSmall+smallwidth},${arrowy} L${xBlock3-8},${arrowy}`
    const path10=`M${xBlock3+bigblockwidth},${arrowy} L${xtenSmall-8},${arrowy}`
    const path11=`M${xtenSmall+smallwidth},${arrowy} L${xElevenSmall-8},${arrowy}`
    const path12=`M${xElevenSmall+smallwidth},${arrowy} L${xBlock4-8},${arrowy}`
    useEffect(() => {
        const img_promises = images.map(image => getImage(folder_path + "..." + image));

        Promise.all(img_promises)
            .then((results) => {
                // Filter out undefined results before setting the state
                const filteredResults = results.filter((result): result is string => result !== undefined);
                setImages(filteredResults);
            })
            .catch(console.error);
        
        
    }, [images, folder_path]);

    return (
        <div>
            {/* Create an SVG element for D3 to work with */}
            {/*The ref attribute attaches the d3Container ref to the SVG element, which allows D3 to directly access and manipulate this element.*/}
            
            <svg width="1180" height="600" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <marker 
                id='head' 
                orient="auto" 
                markerWidth='3' 
                markerHeight='4' 
                refX='0.1' 
                refY='2'
                >
                <path d='M0,0 V4 L2,2 Z' fill={rectstroke} />
                </marker>
            </defs>
            {/*Arrows */}
                <rect stroke="#000" strokeWidth="1" id="svg_1" x={encoderx} y={encodery} width={encwidth} height={encheight} fill="#fff" rx = "10" ry = "10"/>
                <text x={encoderx+encwidth/2} y={encodery-30} className="horizontal-texts-large" id="svg_35" textAnchor="middle" dominantBaseline="middle">Vision Transformer Encoder with 12 Transformer blocks</text>
                
                <rect stroke={rectstroke} id="svg_29" x={xBlock1} y={bigblocky} width={bigblockwidth} height={bigblockheight} fill={rectfill} rx = "10" ry = "10"/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="0" cy={pos["0"][0]} cx={pos["0"][1]} fill={displayN === "0" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("0")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="1" cy={pos["1"][0]} cx={pos["1"][1]} fill={displayN === "1" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("1")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="2" cy={pos["2"][0]} cx={pos["2"][1]} fill={displayN === "2" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("2")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="3" cy={pos["3"][0]} cx={pos["3"][1]} fill={displayN === "3" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("3")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="4" cy={pos["4"][0]} cx={pos["4"][1]} fill={displayN === "4" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("4")} onMouseOut={handleMouseOut}/>
                <text x= {cxBlock1} y={circleystart-80} className="horizontal-texts" style={{fontWeight:"bold"}} id="svg_60" textAnchor="middle" dominantBaseline="middle">Transformer block</text>
                <text x={cxBlock1} y={circleystart-60} id="svg_63" className="horizontal-texts" style={{fontWeight:"bold"}} textAnchor="middle" dominantBaseline="middle">1</text>
                
                <rect stroke={rectstroke} strokeWidth="1" id="svg_22" x={xBlock2} y={bigblocky} width={bigblockwidth} height={bigblockheight} fill={rectfill} rx = "10" ry = "10"/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="5" cy={pos["5"][0]} cx={pos["5"][1]} fill={displayN === "5" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("5")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="6" cy={pos["6"][0]} cx={pos["6"][1]} fill={displayN === "6" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("6")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="7" cy={pos["7"][0]} cx={pos["7"][1]} fill={displayN === "7" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("7")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="8" cy={pos["8"][0]} cx={pos["8"][1]} fill={displayN === "8" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("8")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="9" cy={pos["9"][0]} cx={pos["9"][1]} fill={displayN === "9" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("9")} onMouseOut={handleMouseOut}/>
                <text x= {cxBlock2}  y={circleystart-80} style={{fontWeight:"bold"}} id="svg_61" textAnchor="middle" dominantBaseline="middle" className="horizontal-texts">Transformer block</text>
                <text x= {cxBlock2}  y={circleystart-60} style={{fontWeight:"bold"}} id="svg_64" textAnchor="middle" dominantBaseline="middle" className="horizontal-texts" >6</text>
               
                <rect stroke={rectstroke} strokeWidth="1" id="svg_15" x={xBlock3} y={bigblocky} width={bigblockwidth} height={bigblockheight} fill={rectfill}rx = "10" ry = "10"/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="10" cy={pos["10"][0]} cx={pos["10"][1]} fill={displayN === "10" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("10")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="11" cy={pos["11"][0]} cx={pos["11"][1]} fill={displayN === "11" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("11")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="12" cy={pos["12"][0]} cx={pos["12"][1]} fill={displayN === "12" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("12")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="13" cy={pos["13"][0]} cx={pos["13"][1]} fill={displayN === "13" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("13")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="14" cy={pos["14"][0]} cx={pos["14"][1]} fill={displayN === "14" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("14")} onMouseOut={handleMouseOut}/>
                <text x= {cxBlock3} y={circleystart-80} style={{fontWeight:"bold"}} id="svg_62" textAnchor="middle" dominantBaseline="middle" className="horizontal-texts" >Transformer block</text>
                <text x= {cxBlock3} y={circleystart-60} style={{fontWeight:"bold"}} id="svg_65" textAnchor="middle" dominantBaseline="middle" className="horizontal-texts">10</text>
         
                <rect stroke={rectstroke} strokeWidth="1" id="svg_6" x={xBlock4} y={bigblocky} width={bigblockwidth} height={bigblockheight} fill={rectfill} rx = "10" ry = "10"/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="15" cy={pos["15"][0]} cx={pos["15"][1]} fill={displayN === "15" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("15")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="16" cy={pos["16"][0]} cx={pos["16"][1]} fill={displayN === "16" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("16")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="17" cy={pos["17"][0]} cx={pos["17"][1]} fill={displayN === "17" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("17")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="18" cy={pos["18"][0]} cx={pos["18"][1]} fill={displayN === "18" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("18")} onMouseOut={handleMouseOut}/>
                    <ellipse stroke={circleStroke} ry={cry} rx={crx} id="19" cy={pos["19"][0]} cx={pos["19"][1]} fill={displayN === "19" &&isHovered? hoverfill:circlefill} onMouseOver={()=> handleMouseOver("19")} onMouseOut={handleMouseOut}/>
                    <text x={pos["15"][1]+140} y={pos["15"][0]} textAnchor="middle" className="horizontal-texts">Goose</text>
                    <text x={pos["16"][1]+140} y={pos["16"][0]} textAnchor="middle" className="horizontal-texts">Persian cat</text>
                    <text x={pos["17"][1]+140} y={pos["17"][0]} textAnchor="middle" className="horizontal-texts">Indian Elephant</text>
                    <text x={pos["18"][1]+140} y={pos["18"][0]} textAnchor="middle" className="horizontal-texts">Harp</text>
                    <text x={pos["19"][1]+140} y={pos["19"][0]} textAnchor="middle" className="horizontal-texts">Ford Model T</text>
                    <text x={pos["15"][1]+140} y={pos["15"][0]-70} style={{fontWeight:"bold"}} id="svg_58" textAnchor="middle" dominantBaseline="middle" className="horizontal-texts">Classes</text>
                    <text x={pos["15"][1]} y={bigblocky-60} style={{fontWeight:"bold"}} id="svg_58" textAnchor="middle" dominantBaseline="middle" className="horizontal-texts">Classification</text>
                    <text x={pos["15"][1]} y={bigblocky-30} style={{fontWeight:"bold"}} id="svg_59" textAnchor="middle" dominantBaseline="middle" className="horizontal-texts">Head</text>

                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path1} />
                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xOfFirstSmallBlock} y={smallblocky} width={smallwidth} height={smallheight} id="svg_43"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path2} />

                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xSecondSmall} y={smallblocky}width={smallwidth} height={smallheight}  id="svg_44"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path3} />
                
                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xthirdSmall}  y={smallblocky} width={smallwidth} height={smallheight} id="svg_45"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path4} />
                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill}x={xfourthSmall}  y={smallblocky}width={smallwidth} height={smallheight}  id="svg_46"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path5} />

                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xSixSmall} y={smallblocky} width={smallwidth} height={smallheight} id="svg_47"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path6} />
                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xSevenSmall} y={smallblocky}width={smallwidth} height={smallheight}  id="svg_48"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path7} />
                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xEightSmall} y={smallblocky} width={smallwidth} height={smallheight}  id="svg_49"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path8} />
                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xtenSmall} y={smallblocky} width={smallwidth} height={smallheight} id="svg_50" rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path9} />
                <rect stroke={rectstroke} strokeWidth="1" fill={rectfill} x={xElevenSmall} y={smallblocky} width={smallwidth} height={smallheight} id="svg_51"rx = "10" ry = "10"/>
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path10} />
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path11} />
                <path id='arrow-line' markerEnd='url(#head)'strokeWidth='4' stroke={rectstroke}  d={path12} />
                <text
                    x={xOfFirstSmallBlock+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 2 
                </text>
                <text
                    x={xSecondSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 3
                </text>
                <text
                    x={xthirdSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 4
                </text>
                <text
                    x={xfourthSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 5
                </text>
                <text
                    x={xSixSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 7
                </text>
                <text
                    x={xSevenSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 8
                </text>
                <text
                    x={xEightSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 9
                </text>
                <text
                    x={xtenSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 11
                </text>
                <text
                    x={xElevenSmall+smallwidth/2}
                    y={smallblocky+smallheight/2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="vertical_texts">
                    Transformer Block 12
                </text>


                


                <ellipse stroke={circleStroke} fill="#fff" cx="540.31225" cy="375.01141" id="svg_4"/>

               <ImgDisplay neuron ={(displayN ?? "")} isHovered = {isHovered} Images={Images} x={cx} y = {cy}/>
            </svg>
        </div>
    );
}
    
export default ActMax;