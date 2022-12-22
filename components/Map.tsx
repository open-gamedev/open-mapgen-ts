import { nanoid } from '@reduxjs/toolkit';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectMapState } from '../redux/map';
import { selectTerrains } from '../redux/terrains';
import Tile from './Tile';

export default function Map() {
  const ref = useRef<HTMLDivElement>(null);
  const map = useSelector(selectMapState);
  const terrains = useSelector(selectTerrains);
  const dispatch = useDispatch();

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const horizontalSize = width / map.width;
  const verticalSize = height / map.height;
  const sideLength = Math.min(horizontalSize, verticalSize);

  const resizeEventHandler: (this: Window, event: UIEvent) => any = useCallback(
    (event) => {
      setWidth(ref.current?.clientWidth ?? 5);
      setHeight(ref.current?.clientHeight ?? 5);
    },
    [ref]
  );

  useEffect(() => {
    setWidth(ref.current?.clientWidth ?? 5);
    setHeight(ref.current?.clientHeight ?? 5);
    window.addEventListener('resize', resizeEventHandler);

    return () => {
      window.addEventListener('resize', resizeEventHandler);
    };
  }, [resizeEventHandler]);

  const rows = map.mapTiles.map((rows) => {
    const children = rows.map((terrain) => {
      return (
        <Tile
          showGrid={map.showGrid}
          terrain={terrain}
          sideLength={sideLength}
          key={nanoid(9)}
        />
      );
    });
    return (
      <div
        key={nanoid(9)}
        style={{
          width: '100%',
          height: `${sideLength}px`,
          justifyContent: 'center',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        {children}
      </div>
    );
  });

  return (
    <div
      className="w-screen h-screen flex flex-wrap justify-center items-center content-center bg-slate-200"
      ref={ref}
    >
      {rows}
    </div>
  );
}
