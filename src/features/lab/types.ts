export type LabSubject = 'chem' | 'physics' | 'bio';

// ── Chemistry Virtual Lab Types ──
export type ReagentId =
  | 'hcl'
  | 'naoh'
  | 'h2so4'
  | 'water'
  | 'litmus'
  | 'phenol'
  | 'zinc'
  | 'iron'
  | 'copper'
  | 'bacl2'
  | 'caco3';

export interface ChemicalReagent {
  id: ReagentId;
  name: string;
  formula: string;
  type: 'acid' | 'base' | 'metal' | 'salt' | 'indicator' | 'neutral';
  color: string; // CSS color of liquid/solid
  state: 'liquid' | 'solid';
  description: string;
}

export interface ChemistryReactionResult {
  equation: string;
  wordEquation: string;
  solutionColor: string;
  gasReleased?: string; // e.g. "H2"
  gasBubbles?: boolean;
  precipitateColor?: string; // e.g. "#ffffff" for BaSO4
  precipitateName?: string;
  phenomenon: string; // Description of phenomenon
  explanation: string;
}

// ── Physics Circuit Lab Types ──
export type ComponentType = 'battery' | 'switch' | 'bulb' | 'resistor' | 'ammeter' | 'voltmeter';

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  value: number; // Voltage (V) for battery, Resistance (Ω) for bulb/resistor
  state?: boolean; // Switch closed/open
  position: number; // 0-5 in series loop
}

export interface CircuitSimulationState {
  isClosed: boolean;
  isShortCircuit: boolean;
  totalVoltage: number;
  totalResistance: number;
  current: number; // I = U/R in Amperes
  bulbBrightness: number; // 0 to 1
  isBulbBurnt: boolean;
  statusMessage: string;
}

// ── Biology Microscope Lab Types ──
export type SpecimenId = 'onion-cell' | 'cheek-cell' | 'leaf-chloroplast' | 'amoeba';

export interface MicroscopeSpecimen {
  id: SpecimenId;
  name: string;
  source: string;
  stain: string;
  description: string;
  optimalFocus: number; // 0-100 target for sharp focus
  organelles: {
    name: string;
    description: string;
    x: number; // % in field of view
    y: number; // % in field of view
  }[];
}

export type ObjectiveLens = '10x' | '40x' | '100x';

export interface MicroscopeState {
  specimenId: SpecimenId;
  lens: ObjectiveLens;
  coarseFocus: number; // 0-100
  fineFocus: number; // 0-100
  lightIntensity: number; // 0-100
  selectedOrganelle: string | null;
}
