import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import PRRules from './PRRules';
import type { CollaborationData } from '../types/CollaborationData';

const defaultData: CollaborationData['prRules'] = {
  activeVersion: { selectedId: 'semantic', options: {} },
  activeStrategy: { selectedId: 'squash', options: {} },
  labelRules: { selectedIds: ['feature', 'fix'], options: {} },
};

describe('PRRules', () => {
  describe('버전 관리 방식', () => {
    it('버전 버튼 클릭 시 onUpdate("activeVersion", key)를 호출한다', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();

      render(<PRRules data={defaultData} onUpdate={onUpdate} />);

      const calendarButton = screen.getByRole('button', { name: /캘린더/i });
      await user.click(calendarButton);

      expect(onUpdate).toHaveBeenCalledWith('activeVersion', 'calendar');
    });

    it('버전 버튼에 hover 시 tooltip 텍스트가 나타난다', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();

      render(<PRRules data={defaultData} onUpdate={onUpdate} />);

      const semanticButton = screen.getByRole('button', { name: /시맨틱/i });
      await user.hover(semanticButton);

      expect(
        screen.getByText('MAJOR.MINOR.PATCH 기반 버전 증가'),
      ).toBeInTheDocument();
    });

    it('버전 버튼에서 mouseLeave 시 tooltip이 사라진다', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();

      render(<PRRules data={defaultData} onUpdate={onUpdate} />);

      const semanticButton = screen.getByRole('button', { name: /시맨틱/i });
      await user.hover(semanticButton);
      await user.unhover(semanticButton);

      expect(
        screen.queryByText('MAJOR.MINOR.PATCH 기반 버전 증가'),
      ).not.toBeInTheDocument();
    });
  });

  describe('병합 전략', () => {
    it('병합 전략 버튼 클릭 시 onUpdate("activeStrategy", key)를 호출한다', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();

      render(<PRRules data={defaultData} onUpdate={onUpdate} />);

      const rebaseButton = screen.getByRole('button', { name: /rebase/i });
      await user.click(rebaseButton);

      expect(onUpdate).toHaveBeenCalledWith('activeStrategy', 'rebase');
    });
  });

  describe('PR 라벨 선택 (토글)', () => {
    it('미선택 라벨 클릭 시 해당 라벨이 추가된 배열로 onUpdate("labelRules", ...)를 호출한다', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();

      render(<PRRules data={defaultData} onUpdate={onUpdate} />);

      // defaultData.labelRules.selectedIds = ['feature', 'fix']
      // 'refactor'는 미선택 상태
      const refactorButton = screen.getByRole('button', { name: /refactor/i });
      await user.click(refactorButton);

      expect(onUpdate).toHaveBeenCalledWith('labelRules', [
        'feature',
        'fix',
        'refactor',
      ]);
    });

    it('이미 선택된 라벨 클릭 시 해당 라벨이 제거된 배열로 onUpdate("labelRules", ...)를 호출한다', async () => {
      const user = userEvent.setup();
      const onUpdate = vi.fn();

      render(<PRRules data={defaultData} onUpdate={onUpdate} />);

      // defaultData.labelRules.selectedIds = ['feature', 'fix']
      // 'feature'는 선택된 상태
      const featureButton = screen.getByRole('button', { name: /^feature$/i });
      await user.click(featureButton);

      expect(onUpdate).toHaveBeenCalledWith('labelRules', ['fix']);
    });
  });
});
