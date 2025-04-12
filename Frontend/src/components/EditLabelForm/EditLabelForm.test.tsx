import { render, screen, fireEvent, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import EditLabelForm from './EditLabelForm'
import { Label } from '../../models/label'
import { ModalContext } from '../Modal/Modal'
import { useCreateLabel } from '../../hooks/useCreateLabel'

jest.mock('../../hooks/useCreateLabel', () => ({
  useCreateLabel: jest.fn(() => ({
    createLabel: jest.fn()
  }))
}))

const mockClose = jest.fn()
const mockOpen = jest.fn()

const mockLabel: Label = {
  id: '1',
  product_id: '12345',
  last_updated: 'yesterday'
}

const renderComponent = (label: Label | null = null) =>
  render(
    <ModalContext.Provider
      value={{ close: mockClose, open: mockOpen, openName: 'modal' }}
    >
      <EditLabelForm label={label} />
    </ModalContext.Provider>
  )

describe('EditLabelForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with empty fields for new label', () => {
    renderComponent()
    expect(screen.getByLabelText(/product_id/i)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /create label/i })
    ).toBeInTheDocument()
  })

  it('renders correctly with data for edit mode', () => {
    renderComponent(mockLabel)
    const input = screen.getByLabelText(/product_id/i) as HTMLInputElement
    expect(input.value).toBe('12345')
    expect(
      screen.getByRole('button', { name: /update label/i })
    ).toBeInTheDocument()
  })

  it('calls createLabel and closes modal on submit', async () => {
    const createLabelMock = jest.fn()
    ;(useCreateLabel as jest.Mock).mockReturnValue({
      createLabel: createLabelMock
    })

    renderComponent()

    const input = screen.getByLabelText(/product_id/i)
    const button = screen.getByRole('button')

    // Wrap interaction in act()
    await act(async () => {
      fireEvent.change(input, { target: { value: '99999' } })
      fireEvent.click(button)
    })

    expect(createLabelMock).toHaveBeenCalledWith(
      expect.objectContaining({ product_id: '99999' })
    )
    expect(mockClose).toHaveBeenCalled()
  })

  it('shows validation error if input is empty', async () => {
    renderComponent()

    const input = screen.getByLabelText(/product_id/i)
    const button = screen.getByRole('button')

    await act(async () => {
      fireEvent.change(input, { target: { value: '' } })
      fireEvent.click(button)
    })

    expect(
      await screen.findByText(/product_id is required/i)
    ).toBeInTheDocument()
  })
})
