import {
  Button,
  Drawer,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectMapState,
  setMapSize,
  toggleGrid as toggleGridState,
} from '../redux/map';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import styled from '@emotion/styled';
import React, { useCallback, useState } from 'react';
import { selectTerrains } from '../redux/terrains';
import AddTerrain from './AddTerrain';
import TerrainDetails from './TerrainDetails';
import { nanoid } from '@reduxjs/toolkit';

const MyDrawer = styled(Drawer)({
  width: '20vw',
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: '20vw',
    backgroundColor: '#86bffc',
  },
});

const ControlSegmentHeader = (
  props: React.ClassAttributes<HTMLDivElement> &
    React.HTMLAttributes<HTMLDivElement>
) => <div {...props} className={props.className + ' text-white text-2xl'} />;

export interface ControlPanelProps {}

export default function ControlPanel() {
  const [isOpen, setOpen] = useState(true);

  const map = useSelector(selectMapState);
  const terrains = useSelector(selectTerrains);
  const dispatch = useDispatch();

  const [width, setWidth] = useState(map.width.toFixed(0));
  const [height, setHeight] = useState(map.height.toFixed(0));
  const [validWidth, setWidthValidity] = useState(true);
  const [validHeight, setHeightValidity] = useState(true);

  const validateSize = (input: string) =>
    /^[0-9]+$/.test(input) && parseInt(input) >= 10 && parseInt(input) <= 1500;

  const updateWidth: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = useCallback((event) => {
    const newValue = event.currentTarget.value;
    setWidth(newValue);
    setWidthValidity(validateSize(newValue));
  }, []);

  const updateHeight: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = useCallback((event) => {
    const newValue = event.currentTarget.value;
    setHeight(newValue);
    setHeightValidity(validateSize(newValue));
  }, []);

  const toggleGrid: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      dispatch(toggleGridState());
    },
    [dispatch]
  );

  const handleMapGeneration: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    if (validHeight && validWidth) {
      dispatch(
        setMapSize({
          height: parseInt(height),
          width: parseInt(width),
          terrains: terrains,
        })
      );
    }
  };

  const closeControlPanel: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    setOpen(false);
  };

  const openControlPanel: React.MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    setOpen(true);
  };

  return (
    <>
      <MyDrawer open={isOpen} variant="persistent" anchor="left">
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center p-4 border-b">
            <span className="text-white text-2xl">Control Panel</span>
            <IconButton onClick={closeControlPanel}>
              <ArrowBackIos style={{ paddingLeft: '0.4rem' }} />
            </IconButton>
          </div>
          <ControlSegmentHeader className="p-4 text-center">
            Map Options
          </ControlSegmentHeader>
          <div className="flex flex-col text-white border-b px-4">
            <div className="text-center text-lg">Map Size</div>
            <div className="flex flex-row px-4">
              <TextField
                error={!validWidth}
                helperText={validWidth ? undefined : 'Number between 10-1500'}
                inputProps={{ style: { color: 'white' } }}
                id="width"
                label={<span className="text-white">Width</span>}
                variant="standard"
                value={width}
                onChange={updateWidth}
              />
              <TextField
                error={!validHeight}
                helperText={validHeight ? undefined : 'Number between 10-1500'}
                id="height"
                inputProps={{ style: { color: 'white' } }}
                label={<span className="text-white">Height</span>}
                variant="standard"
                value={height}
                onChange={updateHeight}
              />
            </div>
            <FormControlLabel
              className="mt-2"
              control={<Switch onChange={toggleGrid} checked={map.showGrid} />}
              label="Tile Borders"
            />
            <Button
              variant="contained"
              className="rounded-none my-4 bg-[#3f83e9] hover:bg-[#08101d]"
              onClick={handleMapGeneration}
            >
              Generate
            </Button>
          </div>
          <ControlSegmentHeader className="p-4 text-center">
            Terrains
          </ControlSegmentHeader>
          <div className="flex flex-col text-white border-b pb-3">
            <AddTerrain />
          </div>
        </div>
        {terrains.map((terrain) => (
          <TerrainDetails terrain={terrain} key={nanoid(9)} />
        ))}
      </MyDrawer>
      {isOpen ? null : (
        <IconButton
          className="absolute top-2 left-2"
          color="primary"
          onClick={openControlPanel}
        >
          <ArrowForwardIos className="text-3xl" />
        </IconButton>
      )}
    </>
  );
}
