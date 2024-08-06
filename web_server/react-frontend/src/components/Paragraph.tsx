import React from 'react';
import './TextStyles.css';


class ParagraphComponent extends React.Component<{text: string}>{

  render() {
    return (
       <div className='paragraph'>{this.props.text}</div>
    );
  }

}
export default ParagraphComponent;