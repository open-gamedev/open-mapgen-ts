import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HYDRATE } from 'next-redux-wrapper';
import GameMap, { MapData } from '../model/Map';
import Terrain, { TerrainData } from '../model/Terrain';
import { AppState } from './store';

export interface MapState extends MapData {}

const initialState: MapState = GameMap.getInitialMap();

export const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    setMapSize: (
      state,
      action: PayloadAction<{
        width: number;
        height: number;
        terrains: TerrainData[];
      }>
    ) => {
      state.width = action.payload.width;
      state.height = action.payload.height;
      GameMap.generateMap(state, action.payload.terrains);
    },
    
    generateMap: (
      state,
      action: PayloadAction<{ terrains: TerrainData[] }>
    ) => {
      GameMap.generateMap(state, action.payload.terrains);
    },
    updateTile: (
      state,
      action: PayloadAction<{
        x: number;
        y: number;
        targetTerrain: TerrainData;
      }>
    ) => {
      GameMap.updateTile(
        state,
        { x: action.payload.x, y: action.payload.y },
        action.payload.targetTerrain
      );
    },
    toggleGrid: (state) => {
      GameMap.toggleGridLines(state);
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload.map,
      };
    },
  },
});

export const { setMapSize, generateMap, updateTile, toggleGrid } =
  mapSlice.actions;

export const selectMapState = (state: AppState) => state.map;

export default mapSlice.reducer;
