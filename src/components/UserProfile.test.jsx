import '@testing-library/jest-dom/vitest'
import {
  act,
  cleanup,
  render,
  screen,
  waitFor,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest'

import UserProfile from './UserProfile'

const mockUser = {
  id: 1,
  name: 'Leanne Graham',
  username: 'Bret',
  email: 'Sincere@april.biz',
  phone: '1-770-736-8031 x56442',
  website: 'hildegard.org',
}

function successfulResponse(user = mockUser) {
  return {
    ok: true,
    json: vi.fn().mockResolvedValue(user),
  }
}

describe('UserProfile', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  test('shows loading state while request is pending', async () => {
    let resolveRequest

    fetch.mockImplementationOnce(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve
        }),
    )

    render(<UserProfile />)

    expect(screen.getByRole('status')).toHaveTextContent('Loading profile...')

    await act(async () => {
      resolveRequest(successfulResponse())
    })

    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  test('renders user profile after successful request', async () => {
    fetch.mockResolvedValueOnce(successfulResponse())

    render(<UserProfile />)

    expect(
      await screen.findByRole('heading', { name: 'Leanne Graham' }),
    ).toBeInTheDocument()

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(screen.getByText('LG')).toBeInTheDocument()
    expect(screen.getByText('@Bret')).toBeInTheDocument()
    expect(screen.getByText('Sincere@april.biz')).toBeInTheDocument()
    expect(screen.getByText('1-770-736-8031 x56442')).toBeInTheDocument()
    expect(screen.getByText('hildegard.org')).toBeInTheDocument()
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('shows error state when request fails', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<UserProfile />)

    const alert = await screen.findByRole('alert')

    expect(alert).toHaveTextContent("Couldn't load your profile")
    expect(alert).toHaveTextContent('Failed to load user profile.')
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  test('retries request and renders profile after Try Again', async () => {
    const user = userEvent.setup()

    fetch
      .mockRejectedValueOnce(new Error('Network error'))
      .mockResolvedValueOnce(successfulResponse())

    render(<UserProfile />)

    await screen.findByRole('alert')

    await user.click(screen.getByRole('button', { name: 'Try Again' }))

    expect(
      await screen.findByRole('heading', { name: 'Leanne Graham' }),
    ).toBeInTheDocument()

    expect(fetch).toHaveBeenCalledTimes(2)
    expect(screen.getByText('LG')).toBeInTheDocument()
  })
})
