import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SnakePath, type PathNode } from './SnakePath';

const mockNodes: PathNode[] = [
  { id: 'n1', title: 'Bài 1: Mở đầu', type: 'lesson', status: 'completed', stars: 3 },
  { id: 'n2', title: 'Bài 2: Nguyên tử', type: 'lesson', status: 'active' },
  { id: 'n3', title: 'Bài 3: Phân tử', type: 'theory', status: 'locked' },
  { id: 'n4', title: 'Trạm kiểm tra', type: 'checkpoint', status: 'locked' },
  { id: 'n5', title: 'Rương kho báu', type: 'chest', status: 'locked' },
];

describe('SnakePath Component (M3)', () => {
  it('renders all nodes with proper titles', () => {
    const handleNodeClick = vi.fn();
    render(<SnakePath nodes={mockNodes} onNodeClick={handleNodeClick} subject="chem" />);

    expect(screen.getByText('Bài 1: Mở đầu')).toBeInTheDocument();
    expect(screen.getByText('Bài 2: Nguyên tử')).toBeInTheDocument();
    expect(screen.getByText('Bài 3: Phân tử')).toBeInTheDocument();
    expect(screen.getByText('Trạm kiểm tra')).toBeInTheDocument();
    expect(screen.getByText('Rương kho báu')).toBeInTheDocument();
  });

  it('renders hand-drawn dashed path and decorations in SVG', () => {
    const { container } = render(<SnakePath nodes={mockNodes} onNodeClick={vi.fn()} subject="chem" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Check presence of bubbles and glints
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(0);
  });

  it('renders start badge for active node', () => {
    render(<SnakePath nodes={mockNodes} onNodeClick={vi.fn()} subject="chem" />);
    expect(screen.getByText('BẮT ĐẦU')).toBeInTheDocument();
  });

  it('triggers onNodeClick callback when clicking a node', () => {
    const handleNodeClick = vi.fn();
    render(<SnakePath nodes={mockNodes} onNodeClick={handleNodeClick} subject="chem" />);

    const activeNodeBtn = screen.getByLabelText('Bài 2: Nguyên tử');
    fireEvent.click(activeNodeBtn);
    expect(handleNodeClick).toHaveBeenCalledTimes(1);
    expect(handleNodeClick).toHaveBeenCalledWith(mockNodes[1]);
  });

  it('renders chest arrow with "Chinh phục để mở rương!" for locked chest', () => {
    render(<SnakePath nodes={mockNodes} onNodeClick={vi.fn()} subject="chem" />);
    expect(screen.getByText('Chinh phục để mở rương!')).toBeInTheDocument();
  });

  it('supports physics and bio subjects', () => {
    const { rerender } = render(<SnakePath nodes={mockNodes} onNodeClick={vi.fn()} subject="physics" />);
    expect(screen.getByText('Bài 2: Nguyên tử')).toBeInTheDocument();

    rerender(<SnakePath nodes={mockNodes} onNodeClick={vi.fn()} subject="bio" />);
    expect(screen.getByText('Bài 2: Nguyên tử')).toBeInTheDocument();
  });
});
