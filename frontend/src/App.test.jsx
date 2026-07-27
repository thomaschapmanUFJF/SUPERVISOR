import { render, screen } from '@testing-library/react';
import { test, expect } from 'vitest';

test('ambiente de teste do frontend funcionando', () => {
    render(<div data-testid="status">OK</div>);
    expect(screen.getByTestId('status')).toHaveTextContent('OK');
});