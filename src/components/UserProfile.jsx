import { useEffect, useState } from 'react'

const USER_URL = 'https://jsonplaceholder.typicode.com/users/1'

function getUserInitials(name) {
  if (typeof name !== 'string' || !name.trim()) {
    return 'U'
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

function UserProfile() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestId, setRequestId] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(USER_URL)

        if (!response.ok) {
          throw new Error('Failed to load user profile.')
        }

        const data = await response.json()

        if (!cancelled) {
          setUser(data)
        }
      } catch {
        if (!cancelled) {
          setUser(null)
          setError('Failed to load user profile.')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      cancelled = true
    }
  }, [requestId])

  if (loading) {
    return (
      <section className="profile-card" aria-labelledby="profile-title">
        <header className="profile-header">
          <p className="eyebrow">Account</p>
          <h1 id="profile-title">Profile</h1>
          <p className="profile-subtitle">Getting your information...</p>
        </header>

        <div className="loading-profile" aria-hidden="true">
          <div className="skeleton skeleton-avatar" />

          <div className="loading-copy">
            <div className="skeleton skeleton-name" />
            <div className="skeleton skeleton-username" />
          </div>

          <div className="skeleton-fields">
            <div className="skeleton skeleton-field" />
            <div className="skeleton skeleton-field" />
            <div className="skeleton skeleton-field" />
          </div>
        </div>

        <p className="loading-label" role="status">
          Loading profile...
        </p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="profile-card" aria-labelledby="profile-title">
        <header className="profile-header">
          <p className="eyebrow">Account</p>
          <h1 id="profile-title">Profile</h1>
        </header>

        <div className="error-state" role="alert">
          <div className="error-icon" aria-hidden="true">
            !
          </div>

          <h2>Couldn't load your profile</h2>
          <p>{error}</p>
        </div>

        <button
          className="retry-button"
          type="button"
          onClick={() => setRequestId((id) => id + 1)}
        >
          Try Again
        </button>
      </section>
    )
  }

  return (
    <section className="profile-card" aria-labelledby="profile-title">
      <header className="profile-header">
        <p className="eyebrow">Account</p>
        <h1 id="profile-title">Profile</h1>
        <p className="profile-subtitle">Your account information</p>
      </header>

      <div className="identity">
        <div
          className="profile-avatar"
          aria-label={`${user.name} initials`}
        >
          {getUserInitials(user.name)}
        </div>

        <div className="identity-copy">
          <h2>{user.name}</h2>
          <p>@{user.username}</p>
        </div>
      </div>

      <dl className="profile-details">
        <div className="detail-row">
          <dt>Email</dt>
          <dd>{user.email}</dd>
        </div>

        <div className="detail-row">
          <dt>Phone</dt>
          <dd>{user.phone}</dd>
        </div>

        <div className="detail-row">
          <dt>Website</dt>
          <dd>{user.website}</dd>
        </div>
      </dl>
    </section>
  )
}

export default UserProfile
