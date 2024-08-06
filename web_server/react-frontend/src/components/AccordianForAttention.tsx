
import React, { useState} from 'react';
import './Accordian.css';
import './TextStyles.css';


import ImageSmallComponent from './ImageSmall';

/*<div className='paragraph_html' dangerouslySetInnerHTML={{ __html: this.props.text}}></div>*/
interface Props {
  part1: string,
  img1: string,
  img1text : string,
  part2: string,
  img2: string,
  img2text: string,
  part3: string,
  img3: string,
  img3text : string,
  part4 : string
}

const AccordianForAttention : React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };


  return (
    <div className = "accordianWrapper">
      <div className="accordion" id="accordionExample">
          <h2 className="accordion-header" id="headingOne">
            <button
              className={`accordion-button ${isOpen ? 'active' : ''}`}
              type="button"
              onClick={toggleAccordion}
              aria-expanded={isOpen}
              aria-controls="collapseOne"
            >    +     4.2 Multi-head attention block
            </button>
          </h2>
          <div
            id="collapseOne"
            className={`accordion-body ${isOpen ? 'show' : 'hide'}`}
            aria-labelledby="headingOne"
          >
            <div dangerouslySetInnerHTML={{ __html: props.part1}}></div>
            <ImageSmallComponent key={props.img1} img_path={props.img1}></ImageSmallComponent>
            <div dangerouslySetInnerHTML={{ __html: props.part2}}></div>
            <ImageSmallComponent key={props.img1} img_path={props.img2}></ImageSmallComponent>
            <div dangerouslySetInnerHTML={{ __html: props.img2text}}></div>
            <div dangerouslySetInnerHTML={{ __html: props.part3}}></div>
            <ImageSmallComponent key={props.img1} img_path={props.img3}></ImageSmallComponent>
            <div dangerouslySetInnerHTML={{ __html: props.img3text}}></div>
            <div dangerouslySetInnerHTML={{ __html: props.part4}}></div>
          </div>

      </div>
    </div>
  );
}


export default AccordianForAttention;