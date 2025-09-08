import React from 'react'

export default function ShowNotFound() {
  return (
    <section className="w-full flex items-center justify-center py-16">
      <div className="text-center px-4">
        
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Page not found</h1>
        <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
          Sorry, we couldn’t find the page you’re looking for. It might have been moved, deleted, or never existed.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <a href="/" className="inline-flex items-center rounded-md bg-black text-white px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2">
            Go back home
          </a>
        
        </div>
      </div>
    </section>
  )
}
