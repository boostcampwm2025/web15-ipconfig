import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

import CounterInput from './CounterInput';

describe('CounterInput', () => {
  it('+버튼 클릭 시 setValue(value + 1)이 호출된다', async () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();
    const user = userEvent.setup();

    render(
      <CounterInput
        value={3}
        setValue={setValue}
        editValue={false}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    await user.click(screen.getByRole('button', { name: '+' }));

    expect(setValue).toHaveBeenCalledWith(4);
  });

  it('-버튼 클릭 시 setValue(value - 1)이 호출된다', async () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();
    const user = userEvent.setup();

    render(
      <CounterInput
        value={5}
        setValue={setValue}
        editValue={false}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    await user.click(screen.getByRole('button', { name: '-' }));

    expect(setValue).toHaveBeenCalledWith(4);
  });

  it('-버튼 클릭 시 value가 1 미만으로 내려가지 않는다', async () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();
    const user = userEvent.setup();

    render(
      <CounterInput
        value={1}
        setValue={setValue}
        editValue={false}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    await user.click(screen.getByRole('button', { name: '-' }));

    expect(setValue).toHaveBeenCalledWith(1);
  });

  it('+버튼 클릭 시 max 초과 시 setValue(max)가 호출된다', async () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();
    const user = userEvent.setup();

    render(
      <CounterInput
        value={10}
        setValue={setValue}
        editValue={false}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    await user.click(screen.getByRole('button', { name: '+' }));

    expect(setValue).toHaveBeenCalledWith(10);
  });

  it('숫자 span 클릭 시 setEditValue(true)가 호출된다', async () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();
    const user = userEvent.setup();

    render(
      <CounterInput
        value={3}
        setValue={setValue}
        editValue={false}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    await user.click(screen.getByText('3'));

    expect(setEditValue).toHaveBeenCalledWith(true);
  });

  it('editValue=true일 때 input이 렌더링된다', () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();

    render(
      <CounterInput
        value={3}
        setValue={setValue}
        editValue={true}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('input에 문자("abc") 입력 시 setValue가 호출되지 않는다', async () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();
    const user = userEvent.setup();

    render(
      <CounterInput
        value={3}
        setValue={setValue}
        editValue={true}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    await user.type(screen.getByRole('textbox'), 'abc');

    expect(setValue).not.toHaveBeenCalled();
  });

  it('input에서 Enter 키 입력 시 setEditValue(false)가 호출된다', async () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();
    const user = userEvent.setup();

    render(
      <CounterInput
        value={3}
        setValue={setValue}
        editValue={true}
        setEditValue={setEditValue}
        max={10}
      />,
    );

    await user.type(screen.getByRole('textbox'), '{Enter}');

    expect(setEditValue).toHaveBeenCalledWith(false);
  });

  it('isTime=true일 때 값 뒤에 h가 표시된다', () => {
    const setValue = vi.fn();
    const setEditValue = vi.fn();

    render(
      <CounterInput
        value={3}
        setValue={setValue}
        editValue={false}
        setEditValue={setEditValue}
        isTime={true}
        max={10}
      />,
    );

    expect(screen.getByText('3h')).toBeInTheDocument();
  });
});
