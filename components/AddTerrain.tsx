import { Button, Modal, TextField } from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { useDispatch, useSelector } from 'react-redux';
import Terrain from '../model/Terrain';
import { selectTerrains, addTerrain } from '../redux/terrains';

export default function AddTerrain() {
  const [name, setName] = useState('');
  const [probabiliy, setProbability] = useState('1');
  const [color, setColor] = useState('#FFFFFF');
  const [tempColor, setTempColor] = useState(color);
  const [isModalVisible, setModalVisible] = useState(false);

  const terrains = useSelector(selectTerrains);
  const dispatch = useDispatch();

  const [isValid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const openModal: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setModalVisible(true);
  };

  const closeModal: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setModalVisible(false);
  };

  const saveColor: React.MouseEventHandler<HTMLButtonElement> = (event) => {
    setColor(tempColor);
    closeModal(event);
  };

  const testValidity = () => {
    if (name === undefined || name.trim().length === 0) {
      setErrorMessage('Terrain must have a name');
      setValid(false);
      return;
    }
    if (terrains.some((value) => value.name === name)) {
        setErrorMessage('There is a terrain with the same name in the list');
        setValid(false);
        return;
    }
    if (terrains.some((value) => value.color === color) || color === '#FFFFFF') {
      setErrorMessage('There is a terrain with the same color in the list');
      setValid(false);
        return;
  }
    const probability = parseFloat(probabiliy);
    if (isNaN(probability) || probability <= 0 || probability > 1000) {
      setErrorMessage('Probability must be a number between 0 and 1000');
      setValid(false);
      return;
    }
    setValid(true);
    setErrorMessage('');
  };

  useEffect(testValidity, [name, probabiliy, color, terrains])

  const changeName: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setName(event.currentTarget.value);
  };

  const changeProbability: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setProbability(event.currentTarget.value);
  };


  const createTerrain = () => {
    dispatch(addTerrain({
      uid: nanoid(),
      name: name,
      color: color,
      interactions: [],
      probability: parseFloat(probabiliy)
    }));
    setName('');
    setProbability('1');
    setColor('#FFFFFF');
  }

  return (
    <div className="flex flex-col px-4">
      <TextField
        id="terrain_name"
        label="Terrain Name"
        variant="standard"
        color="primary"
        className="mb-3"
        value={name}
        onChange={changeName}
        InputLabelProps={{ style: { color: 'white' } }}
        inputProps={{ style: { color: 'white' } }}
      />
      <TextField
        id="terrian_probability"
        label="Probability"
        variant="standard"
        color="primary"
        className="mb-3"
        value={probabiliy}
        onChange={changeProbability}
        InputLabelProps={{ style: { color: 'white' } }}
        inputProps={{ style: { color: 'white' } }}
      />
      <div className="flex flex-row">
        <div
          className="w-1/2 border border-black"
          style={{ backgroundColor: color }}
        />
        <Button
          variant="contained"
          size="small"
          className=" ml-2 w-1/2 bg-[#0f1f37] hover:bg-[#08101d]"
          onClick={openModal}
        >
          Select Color
        </Button>
      </div>
      <Modal open={isModalVisible}>
        <div className="flex flex-col bg-white px-4 py-6 rounded-xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/6">
          <HexColorPicker
            color={tempColor}
            onChange={setTempColor}
            style={{
              width: '100%',
              paddingBottom: '1rem',
            }}
          />
          <TextField
            id="color_text"
            variant="outlined"
            size="small"
            value={tempColor.toUpperCase()}
          />
          <div className="flex flex-row gap-2 pt-2 justify-center items-center">
            <Button
              variant="outlined"
              size="small"
              color="error"
              className=" w-1/2"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button
              variant="outlined"
              size="small"
              color="success"
              className="w-1/2"
              onClick={saveColor}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>
      <div className="text-sm text-center text-red-500 pt-3">{errorMessage}</div>
      <Button
        variant="contained"
        disabled={!isValid}
        className="rounded-none my-4 bg-[#3f83e9] hover:bg-[#08101d]"
        onClick={createTerrain}
      >
        Create Terrain
      </Button>
    </div>
  );
}
