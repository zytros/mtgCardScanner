
import React, { useEffect, useState} from 'react';
import './Accordian.css';


import ImageSmallComponent from './ImageSmall';

/*<div className='paragraph_html' dangerouslySetInnerHTML={{ __html: this.props.text}}></div>*/
interface Props {
  html1: string,
  img1: string,
  math1: string,
  math2: string,
  math3: string,
  math4: string,
  html2: string,
  img1text : string,
}

const AccordianForLRP : React.FC<Props> = (props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };
  useEffect(()=>{
    if(typeof window?.MathJax !== "undefined"){
      window.MathJax.typeset()
    }
  },[])

  return (
    <div className = "accordianWrapper">
      <div className="accordion" id="accordionExample2">
        <h2 className="accordion-header" id="heading2">
          <button
            className={`accordion-button ${isOpen ? 'active' : ''}`}
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isOpen}
            aria-controls="collapseOne"
          >
          +   Learn more about Layer-wise Relevance Propagation 
          </button>
        </h2>
        <div
          id="collapse2"
          className={`accordion-body ${isOpen ? 'show' : 'hide'}`}
        >
          <div dangerouslySetInnerHTML={{ __html: props.html1}}></div>
          {props.math1} <br></br><br></br>
          <div dangerouslySetInnerHTML={{ __html: props.math2}}></div>
          <br></br><br></br>
          <div dangerouslySetInnerHTML={{ __html: props.math3}} style={{justifyContent: "center", paddingLeft: "50px"}}></div>
          <br></br><br></br>
          <div dangerouslySetInnerHTML={{ __html: props.math4}}></div>
          <ImageSmallComponent key={props.img1} img_path={props.img1}></ImageSmallComponent>
          <div dangerouslySetInnerHTML={{ __html: props.img1text}}></div>
          <div dangerouslySetInnerHTML={{ __html: props.html2}}></div>
        </div>
      </div>
    </div>
  );
}


export default AccordianForLRP;