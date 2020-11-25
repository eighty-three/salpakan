import React from 'react';

import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';

import 'mutationobserver-shim';
global.MutationObserver = window.MutationObserver;

import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CustomAuthForms from './index';

describe('different contexts', () => {
  // Different contexts but it's all the same since it's the submitFunction that actually matters

  describe('login', () => {
    const mockFn = jest.fn().mockResolvedValue({ message: 'submitted' });
    const mockRouter = { pathname: 'pathname' };
    // Redirects with router.query isn't tested in the component

    const data = {
      forms: ['username', 'password'],
      title: 'Log in',
      submitFunction: mockFn,
      router: mockRouter,
      context: 'login'
    };

    test('renders', () => {
      const component = render(<CustomAuthForms {...data} />);

      expect(screen.getByRole('button', { name: data.title })).toBeInTheDocument();

      expect(component.container.querySelectorAll('input')[0]).toHaveAttribute('type', 'text');
      expect(component.container.querySelectorAll('input')[1]).toHaveAttribute('type', 'password');
    });

    test('submitting works', async () => {
      const component = render(<CustomAuthForms {...data} />);
      const usernameInput = component.container.querySelectorAll('input')[0];
      const passwordInput = component.container.querySelectorAll('input')[1];

      const submitButton = screen.getByRole('button', { name: data.title });

      expect(screen.getByRole('button', { name: data.title })).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      await act(async () => {
        await userEvent.type(usernameInput, 'username');
        await userEvent.type(passwordInput, 'pw');
        fireEvent.click(submitButton);
      });

      expect(mockFn).toHaveBeenCalled();

      // The delay where it shows "Sending..." in the button isn't tested
      expect(screen.getByRole('button', { name: 'submitted' })).toBeInTheDocument();
    });
  });

  describe('signup', () => {
    const mockFn = jest.fn().mockResolvedValue({ error: 'submit error' });
    const mockRouter = { pathname: 'pathname' };

    const data = {
      forms: ['username', 'password'],
      title: 'Sign up',
      submitFunction: mockFn,
      router: mockRouter,
      context: 'signup'
    };

    test('renders', () => {
      const component = render(<CustomAuthForms {...data} />);

      expect(screen.getByRole('button', { name: data.title })).toBeInTheDocument();

      expect(component.container.querySelectorAll('input')[0]).toHaveAttribute('type', 'text');
      expect(component.container.querySelectorAll('input')[1]).toHaveAttribute('type', 'password');
    });

    test('submitting works', async () => {
      const component = render(<CustomAuthForms {...data} />);
      const usernameInput = component.container.querySelectorAll('input')[0];
      const passwordInput = component.container.querySelectorAll('input')[1];

      const submitButton = screen.getByRole('button', { name: data.title });

      expect(screen.getByRole('button', { name: data.title })).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      await act(async () => {
        await userEvent.type(usernameInput, 'username');
        await userEvent.type(passwordInput, 'pw');
        fireEvent.click(submitButton);
      });

      expect(mockFn).toHaveBeenCalled();

      expect(screen.getByRole('button', { name: 'submit error' })).toBeInTheDocument();
    });
  });

  describe('settings', () => {
    const mockFn = jest.fn().mockResolvedValue({ message: 'submitted' });
    const mockRouter = { pathname: 'pathname' };

    const data = {
      forms: ['newUsername', 'password'],
      title: 'Log in',
      submitFunction: mockFn,
      router: mockRouter,
      username: 'test_username',
      context: 'settings'
    };

    test('renders', () => {
      const component = render(<CustomAuthForms {...data} />);

      expect(screen.getByRole('button', { name: data.title })).toBeInTheDocument();

      expect(component.container.querySelectorAll('input')[0]).toHaveAttribute('type', 'text');
      expect(component.container.querySelectorAll('input')[1]).toHaveAttribute('type', 'password');
    });

    test('submitting works', async () => {
      const component = render(<CustomAuthForms {...data} />);
      const usernameInput = component.container.querySelectorAll('input')[0];
      const passwordInput = component.container.querySelectorAll('input')[1];

      const submitButton = screen.getByRole('button', { name: data.title });

      expect(screen.getByRole('button', { name: data.title })).toBeInTheDocument();
      expect(submitButton).toBeInTheDocument();

      await act(async () => {
        await userEvent.type(usernameInput, 'username');
        await userEvent.type(passwordInput, 'pw');
        fireEvent.click(submitButton);
      });

      expect(mockFn).toHaveBeenCalled();

      expect(screen.getByRole('button', { name: 'submitted' })).toBeInTheDocument();
    });
  });
});
