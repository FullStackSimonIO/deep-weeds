export type Box = [number, number, number, number];
export interface Coords {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function boxToCoords(box: Box): Coords {
  const [x1, y1, x2, y2] = box;
  return {
    x: x1,
    y: y1,
    width: x2 - x1,
    height: y2 - y1,
  };
}

export function scaleCoords(
  coords: Coords,
  naturalWidth: number,
  naturalHeight: number,
  displayWidth: number,
  displayHeight: number
): Coords {
  const scaleX = displayWidth / naturalWidth;
  const scaleY = displayHeight / naturalHeight;
  return {
    x: coords.x * scaleX,
    y: coords.y * scaleY,
    width: coords.width * scaleX,
    height: coords.height * scaleY,
  };
}
