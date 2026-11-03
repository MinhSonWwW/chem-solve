import React from 'react';
import { ScientificMinigameRunner } from './ScientificMinigameRunner';

export interface MinigameProps {
  onExit: () => void;
}

// ─── 🧪 Hóa học (7 Minigames) ───
export const PeriodicGuessGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="periodic-guess" onExit={onExit} />
);

export const IndicatorLabGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="indicator-lab" onExit={onExit} />
);

export const PrecipitateCatcherGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="precipitate-catcher" onExit={onExit} />
);

export const MetalRaceGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="metal-race" onExit={onExit} />
);

export const HydrocarbonSorterGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="hydrocarbon-sorter" onExit={onExit} />
);

export const FlameTestGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="flame-test" onExit={onExit} />
);

export const GasCollectorGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="gas-collector" onExit={onExit} />
);

export const ElectrolyteTesterGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="electrolyte-tester" onExit={onExit} />
);

export const SeparationLabGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="separation-lab" onExit={onExit} />
);

export const MetalCorrosionGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="metal-corrosion" onExit={onExit} />
);

export const PolymerFactoryGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="polymer-factory" onExit={onExit} />
);

export const EnergyReactionGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="energy-reaction" onExit={onExit} />
);

// ─── ⚡ Vật lý (12 Minigames) ───
export const CircuitBuilderGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="circuit-builder" onExit={onExit} />
);

export const OpticsTargetGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="optics-target" onExit={onExit} />
);

export const DensityScaleGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="density-scale" onExit={onExit} />
);

export const SpeedRadarGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="speed-radar" onExit={onExit} />
);

export const LeverBalanceGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="lever-balance" onExit={onExit} />
);

export const HeatTransferGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="heat-transfer" onExit={onExit} />
);

export const LensQuizGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="lens-quiz" onExit={onExit} />
);

export const OhmResistorGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="ohm-resistor" onExit={onExit} />
);

export const TransformerGridGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="transformer-grid" onExit={onExit} />
);

export const EchoSonarGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="echo-sonar" onExit={onExit} />
);

export const PressureDiverGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="pressure-diver" onExit={onExit} />
);

export const WorkPowerGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="work-power" onExit={onExit} />
);

// ─── 🌿 Sinh học (12 Minigames) ───
export const DnaPairingGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="dna-pairing" onExit={onExit} />
);

export const MitosisRushGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="mitosis-rush" onExit={onExit} />
);

export const OrganelleQuestGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="organelle-quest" onExit={onExit} />
);

export const PunnettChallengeGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="punnett-challenge" onExit={onExit} />
);

export const FoodChainGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="food-chain" onExit={onExit} />
);

export const ChromosomeDoctorGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="chromosome-doctor" onExit={onExit} />
);

export const BloodFlowGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="blood-flow" onExit={onExit} />
);

export const BloodPressureGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="blood-pressure" onExit={onExit} />
);

export const PhotosynthesisLabGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="photosynthesis-lab" onExit={onExit} />
);

export const PedigreeDetectiveGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="pedigree-detective" onExit={onExit} />
);

export const ReflexArcGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="reflex-arc" onExit={onExit} />
);

export const ImmuneDefenseGame: React.FC<MinigameProps> = ({ onExit }) => (
  <ScientificMinigameRunner gameId="immune-defense" onExit={onExit} />
);

