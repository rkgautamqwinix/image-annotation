// import React from 'react'
// import styled, { keyframes } from 'styled-components'

// const Inner = styled.div`
//   padding: 8px 16px;

//   textarea {
//     border: 0;
//     font-size: 14px;
//     margin: 6px 0;
//     min-height: 60px;
//     outline: 0;
//   }
// `

// const Button = styled.div`
//   background: whitesmoke;
//   border: 0;
//   box-sizing: border-box;
//   color: #363636;
//   cursor: pointer;
//   font-size: 1rem;
//   margin: 0;
//   outline: 0;
//   padding: 8px 16px;
//   text-align: center;
//   text-shadow: 0 1px 0 rgba(0,0,0,0.1);
//   width: 100%;
//   display: inline-block;

//   transition: background 0.21s ease-in-out;

//   &:focus, &:hover {
//     background: #eeeeee;
//   }
// `

// function TextEditor (props) {
//   let button = null;

//   if (props.isUpdate) {
//     const width = (!props.onUpdate != !props.onDelete) ? '100%' : '50%'; // logical XOR
//     button = (
//     <div>
//       {props.onUpdate && <Button onClick={()=>props.onUpdate(props.annotation)} style={{width: width}}>Update</Button>}
//       {props.onDelete && <Button onClick={()=>props.onDelete(props.annotation)} style={{width: width}}>Delete</Button>}
//     </div>
//       );
//   } else {
//     button = (<Button onClick={props.onSubmit}>Submit</Button>)
//   }
//   return (
//     <React.Fragment>
//       <Inner>
//         <textarea
//           placeholder='Write description'
//           onFocus={props.onFocus}
//           onBlur={props.onBlur}
//           onChange={props.onChange}
//           value={props.value}
//         >
//         </textarea>
//       </Inner>
//       {props.value && button}
//     </React.Fragment>
//   )
// }

// export default TextEditor


import React from 'react'
import styled, { keyframes } from 'styled-components'

const Inner = styled.div`
  padding: 8px 16px;
  textarea {
    border: 0;
    font-size: 14px;
    margin: 6px 0;
    min-height: 60px;
    outline: 0;
  },
  input {
    -webkit-writing-mode: horizontal-tb !important;
    text-rendering: auto;
    color: initial;
    letter-spacing: normal;
    word-spacing: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    -webkit-appearance: textfield;
    background-color: white;
    -webkit-rtl-ordering: logical;
    cursor: text;
    overflow: visible;
  }
  input[type=text] {
    width: 100%;
    display: inline;
    border: 1px solid #ccc;
    box-shadow: inset 0 1px 3px #ddd;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 12px;
    padding-bottom: 12px;
  }
`

const Button = styled.div`
  background: whitesmoke;
  border: 0;
  box-sizing: border-box;
  color: #363636;
  cursor: pointer;
  font-size: 1rem;
  margin: 0;
  outline: 0;
  padding: 8px 16px;
  text-align: center;
  text-shadow: 0 1px 0 rgba(0,0,0,0.1);
  width: 100%;
  display: inline-block;
  transition: background 0.21s ease-in-out;
  &:focus, &:hover {
    background: #eeeeee;
  }
`

function TextEditor (props) {
  let button = null;

  if (props.isUpdate) {
    const width = (!props.onUpdate != !props.onDelete) ? '100%' : '50%'; // logical XOR
    button = (
    <div>
      {props.onUpdate && <Button onClick={()=>props.onUpdate(props.annotation)} style={{width: width}}>Update</Button>}
      {props.onDelete && <Button onClick={()=>props.onDelete(props.annotation)} style={{width: width}}>Delete</Button>}
    </div>
      );
  } else {
    button = (<Button onClick={props.onSubmit} style={{display: 'inline', marginRight: '10px'}}>Submit</Button>)
  }

  return (
    <React.Fragment>
      <Inner>
        <input
          type="text"
          placeholder='Write description'
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onChange={props.onChange}
          value={props.value}
        />
      </Inner>
      {props.value && button}
    </React.Fragment>
  )
}

export default TextEditor
