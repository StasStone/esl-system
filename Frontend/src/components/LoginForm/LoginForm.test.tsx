import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginForm from './LoginForm'
import '@testing-library/jest-dom'

// Mocks for useLogin and useSignup
jest.mock('../../hooks/useLogin', () => () => ({
  login: jest.fn(),
  error: null
}))

jest.mock('../../hooks/useSignup', () => () => ({
  signup: jest.fn(),
  error: null
}))

describe('LoginForm', () => {
  it('renders login form by default (no store_id)', () => {
    render(<LoginForm isSignUp={false} />)

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.queryByLabelText(/store_id/i)).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })

  it('renders signup form with store_id', () => {
    render(<LoginForm isSignUp={true} />)

    expect(screen.getByLabelText(/store_id/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('validates required fields (login)', async () => {
    render(<LoginForm isSignUp={false} />)

    fireEvent.click(screen.getByRole('button', { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })

  it('validates required fields (signup)', async () => {
    render(<LoginForm isSignUp={true} />)

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
      expect(screen.getByText(/store id is required/i)).toBeInTheDocument()
    })
  })
})
