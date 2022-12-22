import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import { TerrainData } from '../model/Terrain';
import { AppState } from './store';

export type TerrainState = TerrainData[];

const initialState: TerrainState = [];

export const terrainSlice = createSlice({
  name: 'terrains',
  initialState,
  reducers: {
    addTerrain: (state, action: PayloadAction<TerrainData>) => {
      state.push(action.payload);
      return state;
    },
    removeTerrain: (state, action: PayloadAction<TerrainData>) => {
      const index = state.findIndex((terrain) => {
        return terrain.uid === action.payload.uid;
      });
      if (index !== -1) {
        return state.splice(index, 1);
      }
      return state;
    },
    updateTerrain: (state, action: PayloadAction<TerrainData>) => {
      const index = state.findIndex((testTerrain) => testTerrain.uid === action.payload.uid);
      if (index !== -1) {
        state[index] = action.payload;
      }
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.terrains,
      };
    },
  },
});

export const { addTerrain, removeTerrain, updateTerrain } = terrainSlice.actions;

export const selectTerrains = (state: AppState) => state.terrains;

export default terrainSlice.reducer;
