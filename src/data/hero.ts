import { Document } from './document';

// Interface
export interface Hero extends Document {
  name: string;
  universe?: string;
}
