import Divider from '../base/Divider'
import React from 'react'
import {colorList} from '../../engine/dmxColors'
import { FixtureType, ChannelType, FixtureChannel, channelTypes } from '../../engine/dmxFixtures'
import DoneIcon from '@material-ui/icons/Done';
import { IconButton, TextField } from '@material-ui/core';
import { useTypedSelector } from '../../redux/store';
import { useDispatch } from 'react-redux';
import { updateFixtureType, deleteFixtureType, setEditedFixture } from '../../redux/dmxSlice';
import CloseIcon from '@material-ui/icons/Close';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { useFormik } from 'formik';
import * as yup from 'yup'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem'
import { Menu } from 'electron';

type Props = {
  id: string
}

const validationSchema = yup.object({
  name: yup
    .string('Fixture Name')
    .min(4, 'Name should be a minium 4 characters')
    .required('Fixture Name is required'),
  manufacturer: yup
    .string('Fixture Manufacturer')
});

export default function MyFixtureEditing({ id }: Props) {

  const fixtureType = useTypedSelector(state => state.dmx.fixtureTypesByID[id])
  const dispatch = useDispatch()
  const formik = useFormik({
    initialValues: {
      name: fixtureType.name,
      manufacturer: fixtureType.manufacturer
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      dispatch(setEditedFixture(null))
      dispatch(updateFixtureType({
        id: id,
        name: values.name,
        manufacturer: values.manufacturer,
        channels: []
      }))
    },
  });
  
  const styles: { [key: string]: React.CSSProperties } = {
    root: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center'
    }
  }

  function getColorMenuItems() {
    colorList.map(color => {
      return (<MenuItem key={color} value={color}>color</MenuItem>)
    })
  }

  function getChannelFields(fixtureChannel: FixtureChannel, index: number) {
    if (fixtureChannel.type === ChannelType.Master)
      return null
    if (fixtureChannel.type === ChannelType.Color)
      return (
        <Select id={index + "color"} value={fixtureChannel.color}>
          {getColorMenuItems}
        </Select>
      )
    if (fixtureChannel.type === ChannelType.StrobeSpeed)
      return (
        <>
          <TextField style={{width: '5rem'}} size="small" id="default_strobe" name="default_strobe" label="Strobe Value"
            value={fixtureChannel.default_strobe}
            onChange={() => { }}
            // error={formik.touched.name && Boolean(formik.errors.name)}
            // helperText={formik.touched.name && formik.errors.name}
          />
          <TextField style={{width: '5rem'}} size="small" id="default_solid" name="default_solid" label="Solid Value"
            value={fixtureChannel.default_strobe}
            onChange={() => { }}
            // error={formik.touched.name && Boolean(formik.errors.name)}
            // helperText={formik.touched.name && formik.errors.name}
          />
        </>
      )
    if (fixtureChannel.type === ChannelType.Other)
      return (
        <TextField style={{width: '5rem'}} size="small" id="default" name="default" label="Default Value"
          value={fixtureChannel.default}
          onChange={() => { }}
          // error={formik.touched.name && Boolean(formik.errors.name)}
          // helperText={formik.touched.name && formik.errors.name}
        />
      )
  }

  function getChannelTypeMenuItems() {
    return channelTypes.map(channelType => {
      <MenuItem key={channelType} value={channelType}>channelType</MenuItem>
    })
  }

  function getChannels() {
    return fixtureType.channels.map((fixtureChannel, index) => {
      return (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center' }}>
          <span>{index + 1}</span>
          <Select labelId={"channel" + index + "label"} id={"channel" + index}
            value={fixtureChannel.type}
            onChange={() => {}}
          >
            {getChannelTypeMenuItems()}
          </Select>
          {getChannelFields(fixtureChannel)}
        </div>
      )
    })
  }

  return (
    <>
      <div style={styles.root}>
        <form onSubmit={formik.handleSubmit}>
          <TextField size="small" fullWidth id="name" name="name" label="Name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
          <TextField size="small" fullWidth id="manufacturer" name="manufacturer" label="Manufacturer"
            value={formik.values.manufacturer}
            onChange={formik.handleChange}
            error={formik.touched.manufacturer && Boolean(formik.errors.manufacturer)}
            helperText={formik.touched.manufacturer && formik.errors.manufacturer}
          />
          <span>Channels</span>
          {getChannels()}
          <div style={styles.buttonContainer}>
            <IconButton type="submit">
              <DoneIcon />
            </IconButton>
            <IconButton onClick={() => dispatch(setEditedFixture(null))}>
              <CloseIcon />
            </IconButton>
            <IconButton onClick={() => dispatch(deleteFixtureType(id))}>
              <DeleteForeverIcon />
            </IconButton>
          </div>
        </form>
      </div>
      <Divider marginY="0rem" />
    </>
  )
}
