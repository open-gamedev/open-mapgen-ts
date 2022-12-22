import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  TextField,
} from '@mui/material';
import { nanoid } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { InteractionTypes } from '../model/Interaction';
import { TerrainData } from '../model/Terrain';
import {
  removeTerrain,
  selectTerrains,
  updateTerrain as updateTerrainDispatch,
} from '../redux/terrains';

export type TerrainDetailsProps = {
  terrain: TerrainData;
};

export default function TerrainDetails({ terrain }: TerrainDetailsProps) {
  const [name, setName] = useState(terrain.name);
  const [probability, setProbability] = useState(
    terrain.probability.toLocaleString()
  );
  const [isValid, setValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const terrains = useSelector(selectTerrains);
  const dispatch = useDispatch();
  const interactions = terrain.interactions;

  const [interactionType, setInteractionType] = useState<string>('');
  const [interactionTerrain, setInteractionTerrain] = useState<string>('');
  const [validInteraction, setValidInteraction] = useState(false);
  const [interactionErrorMessage, setInteractionErrorMessage] =
    useState<string>('');

  const checkValidity = () => {
    if (name === undefined || name.trim().length === 0) {
      setErrorMessage('Terrain must have a name');
      setValid(false);
      return;
    }
    const parsedProbability = parseFloat(probability);
    if (
      isNaN(parsedProbability) ||
      parsedProbability <= 0 ||
      parsedProbability > 100000
    ) {
      setErrorMessage('Probability must be a number between 0 and 100 000');
      setValid(false);
      return;
    }
    setValid(true);
    setErrorMessage('');
  };

  const checkInteractionValidity = () => {
    if (
      interactionType === undefined ||
      interactionType === null ||
      !InteractionTypes.some((value) => interactionType === value)
    ) {
      setInteractionErrorMessage('Please choose an interaction type');
      setValidInteraction(false);
      return;
    }
    if (
      interactionTerrain === undefined ||
      !terrains.some((terrain) => terrain.uid === interactionTerrain)
    ) {
      setInteractionErrorMessage('Interaction terrain does not exists');
      setValidInteraction(false);
      return;
    }
    setInteractionErrorMessage('');
    setValidInteraction(true);
  };

  useEffect(checkValidity, [name, probability]);
  useEffect(checkInteractionValidity, [
    interactionType,
    interactionTerrain,
    terrains,
  ]);

  const changeName: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setName(event.currentTarget.value);
  };

  const changeProbability: React.ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement
  > = (event) => {
    setProbability(event.currentTarget.value);
    console.log(event.currentTarget.value);
  };

  const updateTerrain: React.MouseEventHandler = (event) => {
    const updatedTerrain: TerrainData = {
      ...terrain,
      name: name,
      probability: parseFloat(probability),
    };
    dispatch(updateTerrainDispatch(updatedTerrain));
  };

  const deleteTerrain: React.MouseEventHandler = (event) => {
    removeTerrain(terrain);
  };

  const selectInteractionTerrain = (event: SelectChangeEvent<string>) => {
    setInteractionTerrain(event.target.value);
  };

  const selectInteractionType = (event: SelectChangeEvent<string>) => {
    setInteractionType(event.target.value);
  };

  return (
    <div className="flex flex-col py-2 px-4 text-white border-b">
      <div className="flex flex-row justify-between items-center gap-3"></div>
      <TextField
        label="Terrain Name"
        variant="standard"
        color="primary"
        className="mb-3"
        value={name}
        InputLabelProps={{ style: { color: 'white' } }}
        inputProps={{ style: { color: 'white' } }}
        onChange={changeName}
      />
      <TextField
        label="Probability"
        variant="standard"
        color="primary"
        className="mb-3"
        value={probability}
        InputLabelProps={{ style: { color: 'white' } }}
        inputProps={{ style: { color: 'white' } }}
        onChange={changeProbability}
      />
      <div className="flex flex-row gap-4">
        <Button
          variant="contained"
          size="small"
          color="error"
          className=" w-1/2 bg-red-500"
          onClick={deleteTerrain}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          size="small"
          color="success"
          disabled={!isValid}
          onClick={updateTerrain}
          className="w-1/2 bg-lime-400"
        >
          Update
        </Button>
      </div>
      <div className="text-sm text-center text-red-500 pt-3">
        {errorMessage}
      </div>
      <div className="flex flex-col py-4">
        <div className="text-center text-red-500 pt-3">
          Interactions are not stable yet. It will be active with the next version.
        </div>
        <Button
          variant="contained"
          disabled={true}
          className="rounded-none my-4 bg-[#3f83e9] hover:bg-[#08101d]"
        >
          Add Interaction
        </Button>
        <FormControl fullWidth size="small" className="my-4">
          <InputLabel id="with-label">Interacts with</InputLabel>
          <Select
            labelId="with-label"
            id="with-select"
            label="with"
            value={interactionTerrain}
            onChange={selectInteractionTerrain}
          >
            {/* <MenuItem value="undefined">.</MenuItem> */}
            {terrains.map((terrainData) => (
              <MenuItem key={nanoid(9)} value={terrainData.uid}>
                {terrainData.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth size="small">
          <InputLabel id="interaction-label">Interaction</InputLabel>
          <Select
            labelId="interaction-label"
            id="interaction-select"
            label="Interaction"
            value={interactionType}
            onChange={selectInteractionType}
          >
            {/* <MenuItem value="undefined">.</MenuItem> */}
            <MenuItem value="RESTRICTION">Restriction</MenuItem>
            <MenuItem value="LINEAR_INCREASE">Linear Increase</MenuItem>
            <MenuItem value="LINEAR_DECREASE">Linear Decrease</MenuItem>
          </Select>
        </FormControl>
        <div className="text-sm text-center py-2">Probability Multipliers</div>
        <div className="flex flex-row justify-center items-center gap-4">
          <TextField label="Mult (Min)" variant="filled" size="small" />
          <TextField label="Mult (Max)" variant="filled" size="small" />
        </div>
        <div className="text-sm text-center py-2">Effective Range</div>
        <div className="flex flex-row justify-center items-center gap-4">
          <TextField label="Range (Min)" variant="filled" size="small" />
          <TextField label="Range (Max)" variant="filled" size="small" />
        </div>
      </div>
    </div>
  );
}
