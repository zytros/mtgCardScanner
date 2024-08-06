import React from 'react';
import './TextStyles.css';
import Paragraph from './Paragraph';
import { Dictionary } from '../types/content';
import ImageComponent from './Image';
import ActMax from './Actmax';
import AttHeadOutMax from './AttHeadOutMax';
import Brush from './Brush';
import LRP from './LRP';
import GradientDisplay from './GradientDisplay';
import InfoBox from './InfoBox';
import UserGuidanceBox from './UserGuidanceBox';
import ParagraphComponentHTML from './html_paragraph'
import AccordianForAttention from './AccordianForAttention';
import AccordianForLRP from './AccordianForLRP';
import AccordianForArch from './AccordianForArch';
import AccordianForArchWithD3 from './AccordianForArchwithD3';
import VisionTransformerAnimated from './VisionTransformer_animated';

class ChapterComponent extends React.Component<{subtitle: string, paragraphs: Array<Dictionary>}>{

  render() {
    return (
      <div className="chapter">
        <div className="chapter-title">{this.props.subtitle}</div>
        {this.props.paragraphs.map((item) => {
          if (item['type'] === 'text') {
            return <Paragraph key={item['src']} text={item['src']}></Paragraph>
            }
          else if (item['type'] === 'info-box'){
            return <div key={"infobox"} className="centered-infobox"><InfoBox title={item['title']} text={item['text']}></InfoBox></div>
          }
          else if (item['type'] === 'vision-transformer-animated'){
            return <div key={"vision-transformer-animated"}><VisionTransformerAnimated folder_path={item['folder']} images={item['images']} encoder_block={item["encoder_image"]}></VisionTransformerAnimated></div>
          }
          else if (item['type'] === 'user-guidance-box'){
            return <div key={item['text']} className="user-guidance"><UserGuidanceBox title={item['title']} text={item['text']}></UserGuidanceBox></div>
          }
          else if (item['type'] === 'chapter-subtitle') {
            return <div key={item['src']} className="chapter-subtitle">{item['src']}</div>
          }
          else if (item['type'] === 'html') {
              return <ParagraphComponentHTML key={item['src']} text = {item['src']}></ParagraphComponentHTML>
            }
          else if (item['type'] === 'AccordianForArch'){
              return <AccordianForArch key={item['title']} title ={item['title']} src = {item['src']}/>
          }
          else if(item['type'] === 'AccordianForArchWithD3'){
              return <AccordianForArchWithD3 key={item['type']} title ={item['title']} text = {item['text']} folder_path={item['folder']} images={item['images']}/>
          }
          else if (item['type'] === 'accordian') {
              return <AccordianForAttention key='accordianattention' part1 = {item['part1']} img1 = {item['img1']} img1text = {item['img1text']} part2 = {item['part2']} img2 = {item['img2']} img2text = {item['img2text']} part3 = {item['part3']} img3 = {item['img3']} img3text = {item['img3text']} part4 = {item['part4']}></AccordianForAttention>
          }
          else if (item['type'] === 'accordianForLRP') {
            return <AccordianForLRP key={item['html1']} math1 = {item['math1']} html1 = {item['html1']} html2 = {item['html2']} math2 = {item['math2']} math3= {item['math3']} math4 = {item['math4']} img1 = {item['img1']} img1text = {item['img1text']}  ></AccordianForLRP>
          }
          else if (item['type'] === 'LRP') {
              return <div key={item['texthtml']}><LRP texthtml = {item['texthtml']} gt_image_dir_path={item["gt_image_dir_path"]} lrp_image_dir_path={item["lrp_image_dir_path"]} input_data={item["data"]} input_images={item["images"]}/></div>
            }
          else if (item['type'] === 'ActMax') {
              return <div key="ActMax"><ActMax folder_path={item['folder']} images={item['images']}/></div>
            }
          else if (item['type'] === 'image') {
            // console.log(item['imagepath']);
            return <div key={item['imagepath']}> <ImageComponent key={item['imagepath']} img_path={item['imagepath']}></ImageComponent></div>
            }
          else if (item['type'] === 'Brush') {
            return <div key="Brush"><Brush images={item['params']}/></div>
          }
          else if (item['type'] === 'AttHeadOutMax') {
              return <div key="AttHeadOutMax"> <AttHeadOutMax folder_path={item['params'][0]} prefix={item['params'][1]} suffix={item['params'][2]} range_num_heads={item['params'][3]} range_num_block={item['params'][4]}/></div>
              }
          else if (item['type'] === 'GradientDisplay') {
            return <div key={item['texthtml']} style={{padding: 0, border: 0}}> <GradientDisplay texthtml={item['texthtml']} gt_dir_path={item['gt_dir_path']} grad_dir_path={item['grad_dir_path']} images={item['images']} pred_classes={item['pred_classes']}/> </div>;
          }
          else {
            return <div key={item['type']}>ERROR: TYPE NOT DEFINED: {(item['type'])}</div>
            }
          })
        }
      </div>
    );
  }

}
export default ChapterComponent;