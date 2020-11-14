import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import 'jsdom-global/register';
import { render } from '@testing-library/react';

import Navbar from './Navbar';
import { siteTitle } from '@/components/Layout';

describe('navbar', () => {
  test('correct text', () => {
    const component = render(<Navbar />);

    expect(component.container).toHaveTextContent(
      siteTitle
    );
  });

  test('correct link', () => {
    const { getByText } = render(<Navbar />);

    expect(getByText('Delayed Messages').closest('a')).toHaveAttribute(
      'href', '/'
    );
  });
});
