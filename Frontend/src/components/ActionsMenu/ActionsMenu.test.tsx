import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import ActionsMenu from './ActionsMenu'

describe('ActionsMenu component', () => {
  const renderMenu = (id = 1) =>
    render(
      <ActionsMenu>
        <ActionsMenu.Toggle id={id} />
        <ActionsMenu.Body id={id}>
          <div>Menu Content</div>
        </ActionsMenu.Body>
      </ActionsMenu>
    )

  it('renders toggle button', () => {
    renderMenu()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('opens and displays menu content on click', () => {
    renderMenu()

    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)

    expect(screen.getByText('Menu Content')).toBeInTheDocument()
  })

  it('closes menu when clicked again', () => {
    renderMenu()

    const toggle = screen.getByRole('button')
    fireEvent.click(toggle) // open
    fireEvent.click(toggle) // close

    expect(screen.queryByText('Menu Content')).not.toBeInTheDocument()
  })

  it('does not show menu if different ID is open', () => {
    render(
      <ActionsMenu>
        <ActionsMenu.Toggle id={1} />
        <ActionsMenu.Body id={2}>
          <div>Should Not Show</div>
        </ActionsMenu.Body>
      </ActionsMenu>
    )

    const toggle = screen.getByRole('button')
    fireEvent.click(toggle)

    expect(screen.queryByText('Should Not Show')).not.toBeInTheDocument()
  })
})
