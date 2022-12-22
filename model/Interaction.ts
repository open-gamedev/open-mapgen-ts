import { TerrainData } from './Terrain';
import { nanoid } from '@reduxjs/toolkit';
import { MapData } from './Map';
import { Position } from '../types/types';

export interface InteractionData {
  uid: string;
  range: [number, number];
  terrains: TerrainData[];
  relationType: InteractionTypes;
}

export interface RestrictionData extends InteractionData {}

export interface ModInteractionData extends InteractionData {
  maxMult: number;
  minMult: number;
}

export const InteractionTypes = [
  'LINEAR_INCREASE',
  'LINEAR_DECREASE',
  'RESTRICTION',
] as const;

export type InteractionTypes =
typeof InteractionTypes[number]

export class InvalidInteraction extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'INVALID_INTERACTION';
    this.message = message;
  }
}

export default abstract class Interaction {
  private constructor() {}

  static createRestriction(terrains: TerrainData[], range: [number, number]) {
    if (terrains.length < 2) {
      throw new InvalidInteraction(
        'There must be more than 2 terrain available for a restriction type interaction.'
      );
    }
    if (range[0] < 0 || range[1] < 0) {
      throw new InvalidInteraction(
        'Range values must be a non-negative value.'
      );
    }
    if (range[0] > range[1]) {
      throw new InvalidInteraction(
        'Range index 0 can not be bigger than range index 0.'
      );
    }
    const uid = nanoid();
    const restriction: RestrictionData = {
      uid,
      range,
      terrains,
      relationType: 'RESTRICTION',
    };
    // terrains.forEach((terrain) => {
    //   terrain.interactions.push(restriction);
    // });
    return restriction;
  }

  static createModification(
    type: InteractionTypes,
    terrains: TerrainData[],
    range: [number, number],
    multiplierLimits: [number, number]
  ) {
    if (type === 'RESTRICTION') {
      throw new InvalidInteraction(
        'Please use createRestriction() function to create a restriction instead of modification.'
      );
    }
    if (terrains.length < 2) {
      throw new InvalidInteraction(
        'There must be more than 2 terrain available for a restriction type interaction.'
      );
    }
    if (range[0] < 0 || range[1] < 0) {
      throw new InvalidInteraction(
        'Range values must be a non-negative value.'
      );
    }
    if (range[0] > range[1]) {
      throw new InvalidInteraction(
        'Range index 0 can not be bigger than range index 0.'
      );
    }
    if (multiplierLimits[0] < 0 || multiplierLimits[1] < 0) {
      throw new InvalidInteraction(
        'Multiplier values must be a non-negative value.'
      );
    }
    if (multiplierLimits[0] > multiplierLimits[1]) {
      throw new InvalidInteraction(
        'Range index 0 can not be bigger than range index 0.'
      );
    }
    const uid = nanoid();
    const interaction: ModInteractionData = {
      uid,
      range,
      terrains,
      relationType: type,
      minMult: multiplierLimits[0],
      maxMult: multiplierLimits[1],
    };

    // terrains.forEach((terrain) => {
    //   terrain.interactions.push(interaction);
    // });
    return interaction;
  }

  static computeInteractions(
    terrain: TerrainData,
    map: MapData,
    position: Position
  ): number {
    const { interactions } = terrain;
    let combinedMod = 1;
    if (interactions.length === 0) {
      return combinedMod;
    }
    for (let i = 0; i < position.x; i++) {
      for (let j = 0; j < position.y; j++) {
        if (combinedMod === 0) {
          break;
        }
        const tempTerrain = map.mapTiles[i][j];
        const distance = this.getDistance(position, { x: i, y: j });
        for (
          let arrayCounter = 0;
          arrayCounter < interactions.length;
          arrayCounter++
        ) {
          let interaction = interactions[arrayCounter];
          if (
            interaction.terrains.some((temp) => temp.name === tempTerrain.name)
          ) {
            if (interaction.relationType === 'RESTRICTION') {
              if (
                distance >= interaction.range[0] &&
                distance <= interaction.range[1]
              ) {
                combinedMod = combinedMod * 0;
              }
            } else if (interaction.relationType === 'LINEAR_INCREASE') {
              if (
                distance >= interaction.range[0] &&
                distance <= interaction.range[1]
              ) {
                const maxRangeDistance =
                  interaction.range[1] - interaction.range[0];
                const possiblityRange =
                  (interaction as ModInteractionData).maxMult -
                  (interaction as ModInteractionData).minMult;
                const currentPossibilityDistance =
                  distance - interaction.range[0];
                const percentage =
                  currentPossibilityDistance / maxRangeDistance;
                const possibility =
                  possiblityRange * percentage +
                  (interaction as ModInteractionData).minMult;
                combinedMod = combinedMod * possibility;
              }
            } else if (interaction.relationType === 'LINEAR_DECREASE') {
              if (
                distance >= interaction.range[0] &&
                distance <= interaction.range[1]
              ) {
                const maxRangeDistance =
                  interaction.range[1] - interaction.range[0];
                const possiblityRange =
                  (interaction as ModInteractionData).maxMult -
                  (interaction as ModInteractionData).minMult;
                const currentPossibilityDistance =
                  distance - interaction.range[0];
                const percentage =
                  currentPossibilityDistance / maxRangeDistance;
                const possibility =
                  (interaction as ModInteractionData).maxMult -
                  possiblityRange * percentage;
                combinedMod = combinedMod * possibility;
              }
            }
          }
        }
      }
    }
    return combinedMod;
  }

  static getDistance(position: Position, targetLocation: Position) {
    const horizontalDistance = Math.abs(position.x - targetLocation.x);
    const verticalDistance = Math.abs(position.y - targetLocation.y);
    const distance = Math.sqrt(horizontalDistance ** 2 + verticalDistance ** 2);
    return distance;
  }
}
