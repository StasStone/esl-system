import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useNavigate } from 'react-router-dom'
import SideNavigation from './SideNavigation'

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}))

describe('SideNavigation Component', () => {
  const mockNavigate = jest.fn()

  beforeEach(() => {
    ;(useNavigate as jest.Mock).mockReturnValue(mockNavigate)
  })

  it('renders the correct number of links', () => {
    const links = [
      { name: 'Home', link: '/home', subLinks: [] },
      { name: 'About', link: '/about', subLinks: [] }
    ]

    render(<SideNavigation links={links} />)

    const linkElements = screen.getAllByText(/Home|About/)
    expect(linkElements.length).toBe(2)
  })

  it('navigates when a link is clicked', () => {
    const links = [{ name: 'Home', link: '/home', subLinks: [] }]

    render(<SideNavigation links={links} />)

    const homeLink = screen.getByText('Home')

    fireEvent.click(homeLink)

    expect(mockNavigate).toHaveBeenCalledWith('/home')
  })

  it('sets active class when a link is clicked', () => {
    const links = [
      { name: 'Home', link: '/home', subLinks: [] },
      { name: 'About', link: '/about', subLinks: [] }
    ]

    render(<SideNavigation links={links} />)

    const homeLink = screen.getByText('Home')
    const aboutLink = screen.getByText('About')

    fireEvent.click(homeLink)

    expect(homeLink).toHaveClass('nav__link-active')
    expect(aboutLink).toHaveClass('nav__link')
  })
})
