import Divider from '../base/Divider'
import React from 'react'
import EditIcon from '@material-ui/icons/Edit';
import { IconButton } from '@material-ui/core';
import { useTypedSelector } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { setEditedFixture, addFixtureType } from '../../redux/dmxSlice';
import MyFixtureEditing from './MyFixtureEditing';

type Props = {
  id: string
}

export default function MyFixture({ id }: Props) {

  const fixtureType = useTypedSelector(state => state.dmx.fixtureTypesByID[id])
  const editedFixture = useTypedSelector(state => state.dmx.editedFixture)
  const dispatch = useDispatch()
  
  const styles: { [key: string]: React.CSSProperties } = {
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    fixtureInfo: {

    },
    editButton: {
      color: '#fff'
    }
  }

  let infoText = fixtureType.manufacturer || ''
  infoText += fixtureType.name || ''

  if (editedFixture === id) {
    return <MyFixtureEditing id={id} />
  }

  return (
    <>
      <div style={styles.root}>
        {infoText}
        <IconButton style={styles.editButton} onClick={() => dispatch(setEditedFixture(id))}>
          <EditIcon />
        </IconButton>
      </div>
      <Divider marginY="0rem" />
    </>
  )
}
