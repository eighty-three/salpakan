import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import IndividualForm from './IndividualForm';

describe('username true', () => {
  const data = {
    id: 'test_id',
    label: 'test_label',
    username: true,
    title: 'test_title',
    register: jest.fn()
  };

  test('renders', () => {
    const component = render(<IndividualForm {...data} />);

    expect(screen.getByLabelText('test_label:')).toBeInTheDocument();

    expect(component.container.querySelector('input')).toHaveAttribute('type', 'text');
    expect(component.container.querySelector('input')).not.toHaveAttribute('type', 'password');
  });

  test('text input works', async () => {
    const component = render(<IndividualForm {...data} />);
    const input = component.container.querySelector('input');

    expect(screen.getByLabelText('test_label:')).toBeInTheDocument();

    expect(component.container.querySelector('input')).toHaveAttribute('type', 'text');
    expect(component.container.querySelector('input')).not.toHaveAttribute('type', 'password');

    expect(input.value).toEqual('');

    await act(async () => {
      await userEvent.type(input, 'testing input');
    });

    expect(input.value).toEqual('testing input');
  });
});

describe('username false', () => {
  const data = {
    id: 'test_id',
    label: 'test_label',
    username: false,
    title: 'test_title',
    register: jest.fn()
  };

  test('renders', () => {
    const component = render(<IndividualForm {...data} />);

    expect(screen.getByLabelText('test_label:')).toBeInTheDocument();

    expect(component.container.querySelector('input')).toHaveAttribute('type', 'password');
    expect(component.container.querySelector('input')).not.toHaveAttribute('type', 'text');

  });

  test('text input works', async () => {
    const component = render(<IndividualForm {...data} />);
    const input = component.container.querySelector('input');

    expect(screen.getByLabelText('test_label:')).toBeInTheDocument();

    expect(input).toHaveAttribute('type', 'password');
    expect(input).not.toHaveAttribute('type', 'text');

    expect(input.value).toEqual('');

    await act(async () => {
      await userEvent.type(input, 'testing input');
    });

    expect(input.value).toEqual('testing input');
  });
});
