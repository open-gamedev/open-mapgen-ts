import { nanoid } from '@reduxjs/toolkit';
import { Position } from '../types/types';
import Interaction, { InteractionData } from './Interaction';
import Map, { MapData } from './Map';

export interface TerrainProbability {
  terrain: TerrainData;
  finalProbability: number;
}

export interface TerrainData {
  uid: string;
  name: string;
  color: string;
  probability: number;
  interactions: InteractionData[];
}

export default class Terrain {

  private constructor() {}

  static addInteraction(terrains: TerrainData[], interaction: InteractionData) {
    terrains.forEach((terrainData) => {
      terrainData.interactions.push(interaction);
    });
    return terrains;
  }

  static removeInteraction(terrain: TerrainData, index: number) {
    terrain.interactions = terrain.interactions.splice(index,1);
    return terrain;
  }

  static calculateFinalProbability(terrain: TerrainData, map: MapData, position: Position) {
    const finalCoefficient = Interaction.computeInteractions(terrain, map, position);
    return finalCoefficient * terrain.probability;
  }

  getFinalProbability(terrain: TerrainData, map: MapData, position: Position) {
    return Terrain.calculateFinalProbability(terrain, map, position);
  }

  private static blankTerrain: TerrainData = {
    uid: nanoid(),
    name: '',
    color: '#FFFFFF',
    interactions: [],
    probability: 0,
  };

  static getBlankTerrain() {
    return Terrain.blankTerrain;
  }
}
