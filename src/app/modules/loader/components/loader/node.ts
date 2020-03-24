import { SimulationNodeDatum } from 'd3';

// Interface
export interface Node extends SimulationNodeDatum {
  // Attributes
  id: number;
  radius: number;
}
