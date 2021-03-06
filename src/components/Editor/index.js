import React from 'react'
import styled, { keyframes } from 'styled-components'
import TextEditor from '../TextEditor'

const fadeInScale = keyframes`
  from {
    opacity: 0;
    transform: scale(0);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
`

const Container = styled.div`
  background: white;
  border-radius: 2px;
  box-shadow:
    0px 1px 5px 0px rgba(0, 0, 0, 0.2),
    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 3px 1px -2px rgba(0, 0, 0, 0.12);
  margin-top: 16px;
  transform-origin: top left;

  animation: ${fadeInScale} 0.31s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  overflow: hidden;
`

function Editor (props) {
  const { geometry, selection } = props.annotation
  if (!geometry) return null
  var topPosition = geometry.y + geometry.height;
  topPosition = topPosition > 80 ? 80 : topPosition;
  
  let leftPosition = geometry.width < 288 && geometry.x + geometry.width > 85 ? {
                                  right : `0%`
                                } : {
                                  left: `${geometry.x}%`
                                }
  return (
    <Container
      className={props.className}
      style={{
        position: 'absolute',
        top: `${topPosition}%`,
        ...leftPosition,
        ...props.style
      }}
    >
      <TextEditor
        annotation={props.annotation}
        onChange={e => props.onChange({
          ...props.annotation,
          data: {
            ...props.annotation.data,
            text: e.target.value
          }
        })}
        isUpdate={selection.isUpdate}
        onSubmit={props.onCreate}
        onUpdate={props.onUpdate}
        onDelete={props.onDelete}
        value={props.annotation.data && props.annotation.data.text}
        disabledInput={props.disabledInput}
      />
    </Container>
  )
}

Editor.defaultProps = {
  className: '',
  style: {}
}

export default Editor
