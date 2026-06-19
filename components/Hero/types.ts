export interface LightRay {
  yFrac:   number;
  yBase:   number;
  dir:     1 | -1;
  xHead:   number;
  speed:   number;
  length:  number;
  opacity: number;
  width:   number;
  tint:    [number, number, number];
}

export interface MistCloud {
  x:       number;
  y:       number;
  yFrac:   number;
  dir:     1 | -1;
  speed:   number;
  rx:      number;
  ry:      number;
  opacity: number;
}
