import React, { Component } from 'react'
import T from 'prop-types'
import styled from 'styled-components'
import compose from '../utils/compose'
import isMouseHovering from '../utils/isMouseHovering'
import withRelativeMousePos from '../utils/withRelativeMousePos'

import defaultProps from './defaultProps'
import Overlay from './Overlay'

const Container = styled.div`
  clear: both;
  position: relative;
  width: 100%;
  &:hover ${Overlay} {
    opacity: 1;
  }
`

const Img = styled.img`
  display: block;
  width: 100%;
`

const Items = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
`

const Target = Items

export default compose(
  isMouseHovering(),
  withRelativeMousePos()
)(class Annotation extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      showEditor: false
    }
  }

  static propTypes = {
    innerRef: T.func,
    onMouseUp: T.func,
    onMouseDown: T.func,
    onMouseMove: T.func,
    onHideEditor: T.func,
    ignoreModifier: T.func,
    onClick: T.func,
    children: T.object,

    annotations: T.arrayOf(
      T.shape({
        type: T.string
      })
    ).isRequired,
    type: T.string,
    selectors: T.arrayOf(
      T.shape({
        TYPE: T.string,
        intersects: T.func.isRequired,
        area: T.func.isRequired,
        methods: T.object.isRequired
      })
    ).isRequired,

    value: T.shape({
      selection: T.object,
      geometry: T.shape({
        type: T.string.isRequired
      }),
      data: T.object
    }),
    onChange: T.func,
    onSubmit: T.func,
    onCreate: T.func,
    onUpdate: T.func,
    onDelete: T.func,

    activeAnnotationComparator: T.func,
    activeAnnotations: T.arrayOf(T.any),

    disableAnnotation: T.bool,
    disableSelector: T.bool,
    renderSelector: T.func,
    disableEditor: T.bool,
    renderEditor: T.func,
    disabledInput: T.string,

    renderHighlight: T.func.isRequired,
    renderContent: T.func.isRequired,

    disableOverlay: T.bool,
    renderOverlay: T.func.isRequired
  }

  static defaultProps = defaultProps

  setInnerRef = (el) => {
    this.container = el
    this.props.relativeMousePos.innerRef(el)
    this.props.innerRef(el)
  }

  getSelectorByType = (type) => {
    return this.props.selectors.find(s => s.TYPE === type)
  }

  // Sort by area, largest to smallest
  // using this to get stacking order right for selecting existing
  // annotations
  getSortedAnnotations = (annotations) => {
    const { container, getSelectorByType } = this;
    const ordered = annotations
      .filter(a => !!a)
      .sort((a, b) => {
        const aSelector = getSelectorByType(a.geometry.type)
        const bSelector = getSelectorByType(b.geometry.type)

        return -(aSelector.area(a.geometry, container) - bSelector.area(b.geometry, container));
      });
    return ordered;
  }

  getTopAnnotationAt = (x, y) => {
    const { annotations } = this.props
    const { container, getSelectorByType } = this

    if (!container) return

    const intersections = annotations
      .map(annotation => {
        const { geometry } = annotation
        const selector = getSelectorByType(geometry.type)

        return selector.intersects({ x, y }, geometry, container)
          ? annotation
          : false
      })
      .filter(a => !!a)
      .sort((a, b) => {
        const aSelector = getSelectorByType(a.geometry.type)
        const bSelector = getSelectorByType(b.geometry.type)

        return aSelector.area(a.geometry, container) - bSelector.area(b.geometry, container)
      })

    return intersections[0]
  }

  onTargetMouseMove = (e) => {
    this.props.relativeMousePos.onMouseMove(e)
    this.onMouseMove(e)
  }

  onTargetMouseLeave = (e) => {
    this.props.relativeMousePos.onMouseLeave(e)
  }

  onMouseUp = (e) => this.callSelectorMethod('onMouseUp', e)
  onMouseDown = (e) => this.callSelectorMethod('onMouseDown', e)
  onMouseMove = (e) => this.callSelectorMethod('onMouseMove', e)
  onClick = (e) => this.callSelectorMethod('onClick', e)

  onCreate = () => {
    let annotation = {
      ...this.props.value
    }
    if (this.props.value && 
        this.props.disabledInput && 
        ( 
          (this.props.value.data && !this.props.value.data.text) || 
          !this.props.value.data
        ) 
    ){
      annotation = {
        ...annotation,
        data : {
          text : this.props.disabledInput
        }
      }
    }
    if ('onCreate' in this.props) {
      this.props.onCreate(annotation);
    } else {
      // deprecate onSubmit for more explicit 'onCreate' name
      this.props.onSubmit(annotation);
    }
  }

  callSelectorMethod = (methodName, e) => {
    if (this.props.disableAnnotation) {
      return
    }
    if (this.props.ignoreModifier(e)) {
      return;
    }

    if (!!this.props[methodName]) {
      this.props[methodName](e)
    } else {
      const selector = this.getSelectorByType(this.props.type)
      if (selector && selector.methods[methodName]) {
        const value = selector.methods[methodName](this.props.value, e)

        if (typeof value === 'undefined') {
          if (process.env.NODE_ENV !== 'production') {
            console.error(`
              ${methodName} of selector type ${this.props.type} returned undefined.
              Make sure to explicitly return the previous state
            `)
          }
        } else {
          this.props.onChange(value)
        }
      }
    }
  }

  shouldAnnotationBeActive = (annotation, top) => {
    if (this.props.activeAnnotations) {
      const isActive = !!this.props.activeAnnotations.find(active => (
        this.props.activeAnnotationComparator(annotation, active)
      ))

      return isActive || top === annotation
    } else {
      return top === annotation
    }
  }

  // Handle selection of existing annotations to support update or delete
  //
  // Check if parent has enabled edit or delete
  // Make the selected annotation current and pop open the editor
  selectAnnotation = (annotation) => {
    if ('onUpdate' in this.props || 'onDelete' in this.props) {
      const update = {...annotation, selection: {...annotation.selection, showEditor: true, isUpdate: true} };
      this.props.onChange(update);
    }
  }

  render () {
    const { props } = this
    const {
      isMouseHovering,
      renderEditor,
      renderHighlight,
      renderContent,
      renderSelector,
      renderOverlay
    } = props

    const topAnnotationAtMouse = this.getTopAnnotationAt(
      this.props.relativeMousePos.x,
      this.props.relativeMousePos.y
    )

    return (
      <Container
        style={props.style}
        innerRef={isMouseHovering.innerRef}
        onMouseLeave={this.onTargetMouseLeave}
      >
        <Img
          className={props.className}
          style={props.style}
          alt={props.alt}
          src={props.src}
          draggable={false}
          innerRef={this.setInnerRef}
        />
        <Items
          onClick={this.onClick}
          onMouseUp={this.onMouseUp}
          onMouseDown={this.onMouseDown}
          onMouseMove={this.onTargetMouseMove}
        >
          {this.getSortedAnnotations(props.annotations).map(annotation => (
            renderHighlight({
              key: annotation.data.id,
              annotation,
              active: this.shouldAnnotationBeActive(annotation, topAnnotationAtMouse),
              selectAnnotation: this.selectAnnotation
            })
          ))}
          {!props.disableSelector
            && props.value
            && props.value.geometry
            && (
              renderSelector({
                annotation: props.value
              })
            )
          }
        </Items>
        {!props.disableOverlay && (
          renderOverlay({
            type: props.type,
            annotation: props.value
          })
        )}
        {props.annotations.map(annotation => (
          this.shouldAnnotationBeActive(annotation, topAnnotationAtMouse)
          && (
            renderContent({
              key: annotation.data.id,
              annotation: annotation
            })
          )
        ))}
        {!props.disableEditor
          && (props.value
              && props.value.selection
              && props.value.selection.showEditor 
              && renderEditor({
                    annotation: props.value,
                    onChange: props.onChange,
                    onCreate: this.onCreate,
                    onUpdate: props.onUpdate,
                    onDelete: props.onDelete,
                    disabledInput : props.disabledInput
                  })
              )
        }
        <div>{props.children}</div>
      </Container>
    )
  }
})
