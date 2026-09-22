import React from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  MatchGame,
  FormulaBuilderGame,
  EquationBalanceGame,
  SortGame,
  TrueFalseGame,
  SpeedChallengeGame,
  ReviewGame,
  ReactionBuilderGame,
} from '@/features/minigames';

export const GamesPage: React.FC = () => {
  const { gameId } = useParams<{ gameId?: string }>();
  const navigate = useNavigate();

  const handleExitGame = () => {
    navigate('/practice');
  };

  // If no gameId, redirect to the unified Practice & Minigames hub
  if (!gameId) {
    return <Navigate to="/practice" replace />;
  }

  // Render active minigame if gameId matches
  if (gameId === 'match') {
    return <MatchGame onExit={handleExitGame} />;
  }
  if (gameId === 'formula-builder') {
    return <FormulaBuilderGame onExit={handleExitGame} />;
  }
  if (gameId === 'equation-balance') {
    return <EquationBalanceGame onExit={handleExitGame} />;
  }
  if (gameId === 'reaction-builder') {
    return <ReactionBuilderGame onExit={handleExitGame} />;
  }
  if (gameId === 'sort') {
    return <SortGame onExit={handleExitGame} />;
  }
  if (gameId === 'true-false') {
    return <TrueFalseGame onExit={handleExitGame} />;
  }
  if (gameId === 'speed') {
    return <SpeedChallengeGame onExit={handleExitGame} />;
  }
  if (gameId === 'review') {
    return <ReviewGame onExit={handleExitGame} />;
  }

  return <Navigate to="/practice?tab=minigames" replace />;
};
