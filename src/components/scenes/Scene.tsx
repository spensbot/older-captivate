import React from 'react'
import { useTypedSelector } from '../../redux/store'
import { useDispatch } from 'react-redux'
import { setActiveScene, addScene, removeScene, setActiveSceneBombacity, setActiveSceneName, copyActiveScene } from '../../redux/scenesSlice'
import { nanoid } from 'nanoid'
import { initScene } from '../../engine/scene_t'
import { IconButton } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import Slider from '../base/Slider'
import {ButtonMidiOverlay} from '../base/MidiOverlay'
import Input from '../base/Input'
import { Draggable } from 'react-beautiful-dnd'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import CopyIcon from '@material-ui/icons/FileCopy'

const baseStyle: React.CSSProperties = {
  padding: '0.5rem',
  marginRight: '0.3rem',
  marginBottom: '0.3rem',
  display: 'flex',
  alignItems: 'center',
  color: '#fffa'
}

const activeStyle: React.CSSProperties = {
  ...baseStyle,
  border: '0.1rem solid #fffa',
  color: '#fffc'
}

function getColor(bombacity: number) {
  // const min = 100
  // const range = 100
  // const r = min + bombacity * range
  // const g = min
  // const b = min + (1-bombacity) * range
  // return `rgb(${r}, ${g}, ${b})`
  const hueStart = 250
  const hueRange = 110 // 170 
  const hue = (hueStart + bombacity * hueRange) % 360
  return `hsl(${hue}, ${50}%, ${50}%)`
}

export function Scene({ index, id }: { index: number, id: string }) {
  const isActive = useTypedSelector(state => state.scenes.active === id)
  const dispatch = useDispatch()
  const bombacity = useTypedSelector(state => state.scenes.byId[id].bombacity)
  const name = useTypedSelector(state => state.scenes.byId[id].name)

  const onNameChange = (newVal: string) => {
    dispatch(setActiveSceneName(newVal))
  }
  
  const onBombacityChange = (val: number) => { 
    dispatch(setActiveSceneBombacity(val))
  }

  const onRemoveScene = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    dispatch(removeScene({ index: index }))
  }

  let style = isActive ? activeStyle : baseStyle
  style = {
    ...style,
    backgroundColor: getColor(bombacity)
  }

  return (
    <Draggable draggableId={id} index={index}>  
      {provided => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <ButtonMidiOverlay action={{ type: 'setActiveSceneIndex', index: index }}>
            <div style={style} onClick={() => { dispatch(setActiveScene(id)) }}>
              <div style={{
                width: '1rem',
                fontSize: '0.7rem',
                marginLeft: '-0.3rem',
                marginRight: '0.5rem',
                textAlign: 'right',
              }}>{index + 1}</div>
              { isActive ? (
                <div style={{flex: '1 0 auto'}}>
                  <Input value={name} onChange={onNameChange} />
                  <Slider value={bombacity} radius={0.3} orientation="horizontal" onChange={onBombacityChange} />
                </div>
              ) : (
                <>
                <div>{name}</div>
                <div style={{flex: '1 0 0'}} />
                <div {...provided.dragHandleProps}>
                  <DragHandleIcon />
                </div>
                <IconButton aria-label="delete scene" size="small" onClick={onRemoveScene}>
                  <CloseIcon />
                </IconButton>
                </>
              )}
            </div>
          </ButtonMidiOverlay>
        </div>
      )}
    </Draggable>
  )
}


export function NewScene() {
  const dispatch = useDispatch()
  const onNew = () => {
    dispatch(addScene({ id: nanoid(), scene: initScene() }))
  }
  const onCopy = () => {
    dispatch(copyActiveScene())
  }

  return (
    <div style={baseStyle}>
      <IconButton onClick={onNew}><AddIcon /></IconButton>
      <IconButton onClick={onCopy}><CopyIcon /></IconButton>
    </div>
  )
}
