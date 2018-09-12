import React from 'react';
import textBiggerIcon from './assets/quillTextBigIcon.png';
import textSmallerIcon from './assets/quillTextSmallIcon.png';

export default function ToolBarQuill(id, isShown = true) {
    return (
        <div hidden={!isShown} id={'toolbar-quill-' + id}>
         <span className="ql-formats">
          <button className="ql-bold"></button>
          <button className="ql-italic"></button>
          <button className="ql-link"></button>
        </span>
            <span className="ql-formats">
          <button className="ql-header ql-smaller">
            <img src={textSmallerIcon} height='20' alt=""/>
          </button>
          <button className="ql-header ql-bigger" value="1">
            <img src={textBiggerIcon} height='20' alt=""/>
          </button>
        </span>
            <span className="ql-formats">
          <button className="ql-blockquote"></button>
          <select className="ql-background">
            <option value="#cccccc"/>
            <option value="#f06666"/>
            <option value="#ffc266"/>
            <option value="#ffff66"/>
            <option value="#66b966"/>
            <option value="#66a3e0"/>
            <option value="#c285ff"/>
            <option value="#ffffff"/>
            <option value="#facccc"/>
            <option value="#ffebcc"/>
            <option value="#ffffcc"/>
            <option value="#cce8cc"/>
            <option value="#cce0f5"/>
            <option value="#ebd6ff"/>
          </select>
                {/*
          <button className="ql-image"></button>
          <button className="ql-video"></button>
          <button className="ql-formula"></button>
          <button className="ui button" id={'graph-button-'+this.props.id} style={{padding: '0px'}}>
            <img src={graphIcon} width={16} height={16} alt="" />
          </button>
          */}
        </span>
        </div>

    )
}
//

// this is an example for a highly customized toolbar
// see https://devarchy.com/react/library/react-quill
// const BigToolbar = () => (
//     <div id="toolbar-quill">
//     <span className="ql-formats">
//       <select className="ql-size">
//           <option value="12px">Small</option>
//           <option value="16px" selected>Normal</option>
//           <option value="22px">Large</option>
//           <option value="30px">Huge</option>
//       </select>
//       <select className="ql-font">
//         <option value="arial" className="ql-font-arial">Arial</option>
//         <option value="bookman" className="ql-font-bookman">Bookman</option>
//         <option value="courier" className="ql-font-courier">Courier</option>
//         <option value="garamond" className="ql-font-garamond">Garamond</option>
//         <option value="georgia" className="ql-font-georgia">Georgia</option>
//         <option value="helvetica" selected className="ql-font-helvetica">Helvetica</option>
//         <option value="palatino" className="ql-font-palatino">Palatino</option>
//         <option value="times" className="ql-font-times">Times</option>
//         <option value="verdana" className="ql-font-verdana">Verdana</option>
//       </select>
//       <span className="ql-formats">
//         <button className="ql-clean"></button>
//       </span>
//     </span>
//         <span className="ql-formats">
//       <button className="ql-bold"></button>
//       <button className="ql-italic"></button>
//       <button className="ql-underline"></button>
//       <button className="ql-strike"></button>
//     </span>
//         <span className="ql-formats">
//       <select className="ql-color"></select>
//       <select className="ql-background"></select>
//     </span>
//         <span className="ql-formats">
//       <button className="ql-script" value="sub"></button>
//       <button className="ql-script" value="super"></button>
//     </span>
//         <br/>
//         <span className="ql-formats">
//       <button className="ql-list" value="ordered"></button>
//       <button className="ql-list" value="bullet"></button>
//       <select className="ql-align"></select>
//       <button className="ql-indent" value="-1"></button>
//       <button className="ql-indent" value="+1"></button>
//     </span>
//         <span className="ql-formats">
//       <button className="ql-link"></button>
//       <button className="ql-image"></button>
//       <button className="ql-video"></button>
//       <button className="ql-formula"></button>
//       <button className="ui button" id="graph-button"><img src={graphIcon} width={30} alt=""/></button>
//     </span>
//
//     </div>
// )
//
// const SmallToolbar = () => (
//     <div id="toolbar-quill">
//     <span className="ql-formats">
//       <button className="ql-header" style={{fontSize: '21px', marginTop: '0px'}}>T</button>
//       <button className="ql-header" value="1" style={{fontSize: '30px', marginTop: '-6px'}}>T</button>
//       <button className="ql-bold"></button>
//       <button className="ql-italic"></button>
//       <button className="ql-blockquote"></button>
//       <select className="ql-background" style={{marginTop: '-2px'}}>
//         <option value="#cccccc"/>
//         <option value="#f06666"/>
//         <option value="#ffc266"/>
//         <option value="#ffff66"/>
//         <option value="#66b966"/>
//         <option value="#66a3e0"/>
//         <option value="#c285ff"/>
//         <option value="#ffffff"/>
//         <option value="#facccc"/>
//         <option value="#ffebcc"/>
//         <option value="#ffffcc"/>
//         <option value="#cce8cc"/>
//         <option value="#cce0f5"/>
//         <option value="#ebd6ff"/>
//       </select>
//       <button className="ql-link"></button>
//       <button className="ql-image"></button>
//       <button className="ql-video"></button>
//       <button className="ql-formula"></button>
//     </span>
//
//     </div>
// )