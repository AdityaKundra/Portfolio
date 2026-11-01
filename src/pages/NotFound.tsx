import { Link } from 'react-router'

export const NotFound = () => (
  <div className="graph flex min-h-[60vh] items-center">
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-8">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight">This page does not exist.</h1>
      <Link to="/" className="link mt-6 inline-block">Back to the homepage</Link>
    </div>
  </div>
)
