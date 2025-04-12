import { render, screen, fireEvent } from '@testing-library/react'
import Pagination from './Pagination'
import '@testing-library/jest-dom'

describe('Pagination Component', () => {
  const mockOnPrev = jest.fn()
  const mockOnNext = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders previous and next buttons', () => {
    render(
      <Pagination
        continuationToken="someToken"
        previousTokens={['token1', 'token2']}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    )

    expect(screen.getByText(/previous page/i)).toBeInTheDocument()
    expect(screen.getByText(/next page/i)).toBeInTheDocument()
  })

  it('disables previous button when previousTokens is empty', () => {
    render(
      <Pagination
        continuationToken="someToken"
        previousTokens={[]}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    )

    const prevButton = screen.getByText(/previous page/i)
    expect(prevButton).toBeDisabled()
  })

  it('disables next button when continuationToken is null', () => {
    render(
      <Pagination
        continuationToken={null}
        previousTokens={['token1', 'token2']}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    )

    const nextButton = screen.getByText(/next page/i)
    expect(nextButton).toBeDisabled()
  })

  it('calls onPrev when previous button is clicked', () => {
    render(
      <Pagination
        continuationToken="someToken"
        previousTokens={['token1', 'token2']}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    )

    const prevButton = screen.getByText(/previous page/i)
    fireEvent.click(prevButton)

    expect(mockOnPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when next button is clicked', () => {
    render(
      <Pagination
        continuationToken="someToken"
        previousTokens={['token1', 'token2']}
        onPrev={mockOnPrev}
        onNext={mockOnNext}
      />
    )

    const nextButton = screen.getByText(/next page/i)
    fireEvent.click(nextButton)

    expect(mockOnNext).toHaveBeenCalledTimes(1)
  })
})
