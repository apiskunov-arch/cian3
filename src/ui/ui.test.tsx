import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { useState } from 'react';
import { Button, Input, Checkbox, Radio, Select, Modal, Tooltip } from './index';

describe('UI controls', () => {
  it('prevents actions while loading', async () => {
    const click = vi.fn();
    render(
      <Button loading onClick={click}>
        Сохранить
      </Button>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(click).not.toHaveBeenCalled();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });
  it('connects labels and errors to an editable field', async () => {
    render(<Input label="Цена" error="Введите число" />);
    const input = screen.getByLabelText('Цена');
    await userEvent.type(input, '123');
    expect(input).toHaveValue('123');
    expect(input).toHaveAccessibleDescription('Введите число');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
  it('supports keyboard selection and native form values', async () => {
    render(
      <>
        <Checkbox label="С фото" />
        <fieldset>
          <legend>Комнаты</legend>
          <Radio label="1" name="rooms" value="1" />
          <Radio label="2" name="rooms" value="2" />
        </fieldset>
        <Select
          label="Порядок"
          options={[
            { value: 'asc', label: 'Дешевле' },
            { value: 'desc', label: 'Дороже' },
          ]}
        />
      </>,
    );
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(screen.getByLabelText('С фото')).toBeChecked();
    await userEvent.click(screen.getByLabelText('2'));
    expect(screen.getByLabelText('2')).toBeChecked();
    expect(screen.getByLabelText('1')).not.toBeChecked();
    await userEvent.selectOptions(screen.getByLabelText('Порядок'), 'desc');
    expect(screen.getByLabelText('Порядок')).toHaveValue('desc');
  });
  it('closes a modal on cancel and returns focus to its trigger', async () => {
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <>
          <Button onClick={() => setOpen(true)}>Открыть</Button>
          <Modal title="Поиск" open={open} onClose={() => setOpen(false)}>
            <Input label="Название" autoFocus />
          </Modal>
        </>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Открыть' });
    await userEvent.click(trigger);
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAccessibleName('Поиск');
    expect(screen.getByLabelText('Название')).toHaveFocus();
    fireEvent(dialog, new Event('cancel', { bubbles: true, cancelable: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
  it('makes tooltip text available on focus and dismisses on Escape', async () => {
    render(<Tooltip text="Подробности" />);
    await userEvent.tab();
    expect(screen.getByRole('tooltip')).toHaveTextContent('Подробности');
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });
});
