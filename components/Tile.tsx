import { TerrainData } from '../model/Terrain';

export interface TileProps {
  terrain: TerrainData;
  sideLength: number;
  showGrid?: boolean;
}

export default function Tile({ terrain, sideLength, showGrid }: TileProps) {
  return (
    <div
      style={{
        backgroundColor: terrain.color,
        width: `${sideLength}px`,
        height: `100%`,
        cursor: 'pointer',
        borderStyle: showGrid ? 'solid': 'none',
        borderWidth: '1px',
        borderColor: 'black'}}
      title={terrain.name}
    ></div>
  );
}
