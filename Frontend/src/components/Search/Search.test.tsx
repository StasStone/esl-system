import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Search from './Search'
import { useState } from 'react'

function ControlledSearchWrapper() {
  const [value, setValue] = useState('Hello')

  return <Search value={value} onChange={e => setValue(e.target.value)} />
}

describe('Search Component', () => {
  it('renders with initial value and updates correctly on input', () => {
    render(<ControlledSearchWrapper />)

    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('Hello')

    fireEvent.change(input, { target: { value: 'World' } })

    expect(input).toHaveValue('World')
  })
})
