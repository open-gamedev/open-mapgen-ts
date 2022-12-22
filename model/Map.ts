import { Position } from '../types/types';
import Terrain, { TerrainData, TerrainProbability } from './Terrain';

export interface MapData {
  mapTiles: TerrainData[][];
  width: number;
  height: number;
  isAvailable: boolean;
  showGrid: boolean;
}

export default class Map {
  private constructor() {}

  static getInitialMap(): MapData {
    const mapData: MapData = {
      height: 10,
      width: 10,
      isAvailable: false,
      showGrid: true,
      mapTiles: [],
    };
    return Map.generateMap(mapData, []);
  }

  static generateMap(map: MapData, terrains: TerrainData[]): MapData {
    if (map.width < 2 || map.height < 2) {
      return {
        ...map,
        mapTiles: [],
      };
    }

    // Traverse the map tiles
    const rows: TerrainData[][] = (
      Array.from({ length: map.height }) as TerrainData[][]
    ).fill(
      (Array.from({ length: map.width }) as TerrainData[]).fill(
        Terrain.getBlankTerrain(),
        0,
        map.width
      ),
      0,
      map.height
    );
    console.log(`Map Width: ${map.width} Map Height: ${map.height}`);
    console.log(rows);
    map.mapTiles = rows;
    for (let i = 0; i < map.height; i++) {
      const column: TerrainData[] = [];
      for (let j = 0; j < map.width; j++) {
        const selectedTerrain = Map.getRandomizedTerrain(
          map,
          { x: i, y: j },
          terrains
        );
        column[j] = selectedTerrain;
      }
      rows[i] = column;
    }
    map.mapTiles = rows;
    return {
      ...map,
      mapTiles: rows,
    };
  }

  static updateTile(map: MapData, position: Position, terrain: TerrainData) {
    map.mapTiles[position.x][position.y] = terrain;
    return map;
  }

  static toggleGridLines(map: MapData) {
    map.showGrid = !map.showGrid;
    return map;
  }

  private static getRandomizedTerrain(
    map: MapData,
    position: Position,
    terrains: TerrainData[]
  ): TerrainData {
    const probabilityDistribution: TerrainProbability[] = [];
    let probabilityPoolSize: number = 0;
    for (let i = 0; i < terrains.length; i++) {
      const terrain = terrains[i];
      const finalProbability = Terrain.calculateFinalProbability(
        terrain,
        map,
        position
      );
      if (finalProbability > 0) {
        probabilityPoolSize += finalProbability;
        probabilityDistribution.push({
          terrain: terrain,
          finalProbability: finalProbability,
        });
      }
    }
    const randomDecision = Math.random() * probabilityPoolSize;
    let temp = 0;
    for (let i = 0; i < probabilityDistribution.length; i++) {
      const probabilitySample = probabilityDistribution[i];
      if (
        randomDecision >= temp &&
        randomDecision < temp + probabilitySample.finalProbability
      ) {
        return probabilitySample.terrain;
      } else {
        temp += probabilitySample.finalProbability;
      }
    }
    return Terrain.getBlankTerrain();
  }
}
