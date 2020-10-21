export interface ILMarker {
  bindTooltip(toolTip: string): ILMarker;
  addTo(map: ILMap): ILMarker;
}
export interface ILMap {
  setView(coord: number[], scale: number): ILMap;
}

export interface ILIcon {
  iconUrl: string;
  iconSize: number[];
}

export interface ILIconConfig {
  iconUrl: string;
  iconSize: number[];
}

export class LIconConfig implements ILIconConfig {
  constructor(public iconUrl: string, public iconSize: number[]) { }
}

export interface ILMarkerConfig {
  icon: ILIcon;
}

export class LMarkerConfig implements ILMarkerConfig {
  constructor(public icon: ILIcon) { }
}

export interface ILTileLayer {
  addTo(map: ILMap): ILTileLayer;
}

export interface ILTileLayerConfig {
  attribution: string;
}

export class LTileLayerConfig implements ILTileLayerConfig {
  constructor(public attribution: string) { }
}

export interface IL {
  map(name: string): ILMap;
  icon(config: ILIconConfig): ILIcon;
  marker(coords: number[], markerConfig: ILMarkerConfig): ILMarker;
  tileLayer(path: string, config: ILTileLayerConfig): ILTileLayer;
}
