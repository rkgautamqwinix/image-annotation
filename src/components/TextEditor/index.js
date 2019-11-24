import React from 'react'
import styled, { keyframes } from 'styled-components'

const Inner = styled.div`
  padding: 7px 7px;
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
    padding: 9px;
  }
`
const disabled = {
  background : '#ccc'
}
const Button = styled.div`
  background-color: #008CBA; /* Green */
  border: none;
  color: white;
  padding: 7px 7px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  &:focus, &:hover {
    background: #046888;
  }
  &.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`
function TextEditor (props) {
  let button = null;

  if (props.isUpdate && !props.disabledInput) {
    const width = (!props.onUpdate != !props.onDelete) ? '100%' : '34%'; // logical XOR
    button = (
      <div>
        {props.onUpdate && <Button onClick={()=>props.onUpdate(props.annotation)} style={{width: width}}>Update</Button>}
        {props.onDelete && <Button onClick={()=>props.onDelete(props.annotation)} style={{width: width}}>Delete</Button>}
      </div>
    );
  } else if (props.isUpdate && props.onDelete && props.disabledInput){
    button = (<Button onClick={()=>props.onDelete(props.annotation)} 
                      style={{display: 'inline', marginRight: '10px'}}
                      >Delete</Button>)
  } else {
    button = (<Button onClick={
                  (
                    (props.value && props.value.trim() != "") || 
                    (props.disabledInput && props.disabledInput.toString().trim() !="")
                  ) && props.onSubmit
                } 
                disabled={!props.value} 
                style={{display: 'inline', marginRight: '10px'}}>Submit</Button>)
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
          style={props.disabledInput && disabled}
          disabled={props.disabledInput}
          defaultValue={props.disabledInput}
        />
      </Inner>
      <span style={{textAlign : 'center'}}>
        {button}
      </span>
    </React.Fragment>
  )
}

export default TextEditor
