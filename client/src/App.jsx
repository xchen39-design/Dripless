import { useState, useEffect } from 'react'
import './App.css'
import leafCircuit from './assets/leaf-circuit.jpg'

const API_URL = '/api/outfit'

const FAST_FASHION_FACTS = [
  'The fashion industry produces 10% of global carbon emissions',
  'A single polyester shirt takes 200 years to decompose',
  'Only 1% of clothing is recycled into new clothing',
  'The average person buys 60% more clothes than 15 years ago',
  'Fast fashion produces 20% of global wastewater',
  '85% of textiles end up in landfills each year',
  'It takes 2,700 liters of water to make one cotton t-shirt',
  'Washing synthetic clothes releases 500,000 tons of microplastics yearly',
]

function App() {
  const [screen, setScreen] = useState('landing')
  const [preview, setPreview] = useState(null)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')
  const [imgError, setImgError] = useState(false)
  const [gender, setGender] = useState('unisex')
  const [season, setSeason] = useState('spring')
  const [loadingFactIndex, setLoadingFactIndex] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const connect = () => {
      const elements = document.querySelectorAll(
        '.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-fade'
      )
      elements.forEach((el) => observer.observe(el))
    }

    let innerRaf
    const raf = requestAnimationFrame(() => {
      innerRaf = requestAnimationFrame(connect)
    })

    return () => {
      cancelAnimationFrame(raf)
      cancelAnimationFrame(innerRaf)
      observer.disconnect()
    }
  }, [screen])

  const outfitImage = results?.outfitImage

  useEffect(() => {
    if (screen !== 'loading') return undefined
    const id = setInterval(() => {
      setLoadingFactIndex((i) => (i + 1) % FAST_FASHION_FACTS.length)
    }, 3000)
    return () => clearInterval(id)
  }, [screen])

  const handleCapture = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
      setError('Please select a JPEG, PNG or WebP image under 8 MB')
      setScreen('error')
      return
    }

    const reader = new FileReader()
    reader.onload = async () => {
      const base64 = reader.result
      setPreview(base64)
      setLoadingFactIndex(0)
      setImgError(false)
      setScreen('loading')

      try {
        const res = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, gender, season }),
          signal: AbortSignal.timeout(240000),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData.error || `Server error (${res.status})`)
        }

        const data = await res.json()
        setResults(data)
        setScreen('results')
      } catch (err) {
        console.error('API error:', err)
        setError(err.message || 'Something went wrong. Please try again.')
        setScreen('error')
      }
    }
    reader.onerror = () => {
      setError('Failed to read the image file.')
      setScreen('error')
    }
    reader.readAsDataURL(file)
  }

  const resetToCapture = () => {
    setScreen('capture')
    setPreview(null)
    setResults(null)
    setError('')
    setImgError(false)
  }

  const goToLanding = () => {
    setScreen('landing')
    setPreview(null)
    setResults(null)
    setError('')
    setImgError(false)
  }

  if (screen === 'landing') {
    return (
      <div key={screen} className="app app-landing screen">
        <section className="z-hero">
          <div
            style={{
              position: 'relative',
              height: '100vh',
              overflow: 'hidden',
              width: '100%',
            }}
          >
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                zIndex: 0,
              }}
            >
              <source src="/fashion-video.mp4" type="video/mp4" />
            </video>
            <div
              aria-hidden
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.3) 100%)',
                zIndex: 1,
              }}
            />
            <div
              className="z-hero-content-grid"
              style={{
                position: 'relative',
                zIndex: 2,
                height: '100%',
                minHeight: '100%',
              }}
            >
              <div className="z-hero-left" style={{ position: 'relative', zIndex: 2 }}>
                <p
                  className="z-hero-kicker"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  AI-powered fashion
                </p>
                <h1 className="z-hero-title">
                  <span style={{ color: '#FFFFFF' }}>DRESS</span>
                  <span style={{ color: '#FFFFFF', fontStyle: 'italic' }}>DIFFERENT.</span>
                </h1>
                <p className="z-hero-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Build complete outfits around what you own. Discover secondhand options for your next outfit.
                </p>
                <button
                  type="button"
                  className="btn-zara btn-zara--light btn-hero-cta"
                  onClick={() => setScreen('capture')}
                >
                  Scan Your Clothes
                </button>
                <p className="z-hero-scroll" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Scroll to explore
                </p>
              </div>
              <div
                className="z-hero-right"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  position: 'relative',
                  height: '100%',
                  zIndex: 2,
                }}
                aria-hidden="true"
              />
            </div>
            <p
              className="z-hero-powered"
              style={{
                position: 'absolute',
                left: '80px',
                bottom: '40px',
                zIndex: 5,
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
              }}
            >
              Powered by GPT-4o
            </p>
            <img
              src={leafCircuit}
              alt="Dripless"
              style={{
                position: 'absolute',
                bottom: '40px',
                right: '60px',
                height: '180px',
                width: 'auto',
                objectFit: 'contain',
                mixBlendMode: 'screen',
                opacity: 0.85,
                zIndex: 5,
              }}
            />
          </div>
        </section>

        <section className="z-stats">
          <div className="z-stats-inner">
            <p className="z-stats-section-label reveal">By the numbers</p>
            <div className="z-stats-grid">
              <div className="z-stat">
                <p className="z-stat-num reveal-up" style={{ transitionDelay: '0.1s' }}>
                  92M
                </p>
                <p className="z-stat-label reveal" style={{ transitionDelay: '0.1s' }}>
                  Tonnes of textile waste yearly
                </p>
              </div>
              <div className="z-stat">
                <p className="z-stat-num reveal-up" style={{ transitionDelay: '0.2s' }}>
                  75%
                </p>
                <p className="z-stat-label reveal" style={{ transitionDelay: '0.2s' }}>
                  Want to shop sustainably
                </p>
              </div>
              <div className="z-stat">
                <p className="z-stat-num reveal-up" style={{ transitionDelay: '0.3s' }}>
                  35%
                </p>
                <p className="z-stat-label reveal" style={{ transitionDelay: '0.3s' }}>
                  Actually do
                </p>
              </div>
            </div>
            <hr className="z-stats-divider" />
            <p className="z-stats-tagline reveal">Dripless closes that gap.</p>
          </div>
        </section>

        <section className="z-how">
          <div className="z-how-intro">
            <p className="z-how-kicker reveal">How it works</p>
            <h2 className="z-how-headline reveal">Three steps. One outfit.</h2>
          </div>
          <div className="z-how-cards">
            <div className="z-how-card reveal reveal-delay-1">
              <p className="z-how-card-num">01</p>
              <h3>Scan</h3>
              <p>Point your camera at any clothing item you own or are about to buy</p>
            </div>
            <div className="z-how-card reveal reveal-delay-2">
              <p className="z-how-card-num">02</p>
              <h3>Style</h3>
              <p>AI builds a complete outfit using color theory and fashion logic</p>
            </div>
            <div className="z-how-card reveal reveal-delay-3">
              <p className="z-how-card-num">03</p>
              <h3>Shop</h3>
              <p>Search for secondhand options that complement your wardrobe. Check each listing for condition and availability.</p>
            </div>
          </div>
        </section>

        <section className="z-quote">
          <div className="z-quote-inner">
            <blockquote className="reveal">
              Fast fashion is the world&apos;s second most polluting industry. You didn&apos;t cause it. But you
              can opt out.
            </blockquote>
            <div className="z-quote-line reveal-fade" aria-hidden="true" />
            <p className="z-quote-source reveal">United Nations Environment Programme</p>
            <p className="z-quote-follow reveal">
              Give the clothes you already own a new way to be worn.
            </p>
          </div>
        </section>

        <section className="z-cta">
          <h2 className="z-cta-title">
            <span className="reveal">Your wardrobe.</span>
            <span className="reveal" style={{ transitionDelay: '0.12s' }}>
              Reimagined.
            </span>
          </h2>
          <p className="z-cta-sub reveal" style={{ transitionDelay: '0.2s' }}>
            Scan anything. Style everything. Spend less.
          </p>
          <button
            type="button"
            className="btn-zara btn-zara--red reveal"
            style={{ transitionDelay: '0.28s' }}
            onClick={() => setScreen('capture')}
          >
            Start Styling
          </button>
        </section>
      </div>
    )
  }

  if (screen === 'capture') {
    return (
      <div key={screen} className="app app-capture screen">
        <nav className="capture-nav">
          <p className="capture-nav-brand">Dripless</p>
          <button type="button" className="btn-nav" onClick={goToLanding}>
            ← Back
          </button>
        </nav>
        <main className="capture-main">
          <div className="capture-zone-wrap">
            <input
              id="capture-gallery"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handleCapture}
            />
            <label htmlFor="capture-gallery" className="capture-zone reveal-up reveal-delay-1">
              <span className="capture-zone-title">Choose a photo to begin</span>
              <span className="capture-zone-hint">or click to upload</span>
            </label>
            <div className="capture-toggles" aria-label="Outfit preferences">
              <div className="capture-toggle-row reveal reveal-delay-2">
                {(['men', 'women', 'unisex']).map((g) => (
                  <button
                    key={g}
                    type="button"
                    className={`toggle-btn${gender === g ? ' toggle-btn--selected' : ''}`}
                    onClick={() => setGender(g)}
                  >
                    {g === 'men' ? 'Men' : g === 'women' ? 'Women' : 'Unisex'}
                  </button>
                ))}
              </div>
              <div className="capture-toggle-row reveal reveal-delay-3">
                {([
                  ['spring', 'Spring'],
                  ['summer', 'Summer'],
                  ['autumn', 'Autumn'],
                  ['winter', 'Winter'],
                ]).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    className={`toggle-btn${season === value ? ' toggle-btn--selected' : ''}`}
                    onClick={() => setSeason(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="capture-actions reveal reveal-delay-4">
              <label htmlFor="capture-camera" className="btn-zara btn-zara--dark">
                Open Camera
                <input
                  id="capture-camera"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  hidden
                  onChange={handleCapture}
                />
              </label>
              <label htmlFor="capture-gallery" className="btn-zara btn-zara--light">
                Upload Photo
              </label>
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (screen === 'loading') {
    return (
      <div key={screen} className="app app-loading screen">
        <div className="loading-inner">
          {preview && <img src={preview} alt="Your clothing item" className="loading-preview" />}
          <h2>Building your outfit...</h2>
          <p key={loadingFactIndex} className="loading-fact">
            {FAST_FASHION_FACTS[loadingFactIndex]}
          </p>
        </div>
        <div className="loading-bar-track" aria-hidden="true">
          <div className="loading-bar-fill" />
        </div>
      </div>
    )
  }

  if (screen === 'error') {
    return (
      <div key={screen} className="app app-error screen">
        <div className="error-inner">
          <h2>Something went wrong</h2>
          <p>{error}</p>
          <button type="button" className="btn-zara btn-zara--dark" onClick={resetToCapture}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  const { analysis, suggestions } = results || {}

  return (
    <div key={screen} className="app app-results screen">
      <nav className="results-nav">
        <span className="capture-nav-brand">Dripless</span>
        <button type="button" className="btn-nav" onClick={resetToCapture}>
          ← Scan Another
        </button>
      </nav>

      <div className="results-screen">
        {outfitImage && !imgError && (
          <div className="results-outfit-wrap">
            <img
              src={outfitImage}
              alt="Generated outfit"
              className="results-outfit-img reveal-fade"
              onError={() => setImgError(true)}
            />
          </div>
        )}
        {results?.demo && <p role="status">Demo mode — sample styling only. Your photo has not been analyzed; no live products or AI image were generated.</p>}
        {results?.warnings?.map((warning, index) => <p role="status" key={index}>{warning}</p>)}
        {imgError && <div className="outfit-fallback">Outfit preview unavailable</div>}

        <hr className="results-rule" />

        {analysis && (
          <>
            <p className="results-kicker reveal reveal-delay-1">Your Outfit</p>
            <div className="analysis-tags">
              <span className="tag-pill reveal reveal-delay-2">{analysis.brand}</span>
              <span className="tag-pill reveal reveal-delay-2">{analysis.itemType}</span>
              <span className="tag-pill reveal reveal-delay-2">{analysis.color}</span>
              <span className="tag-pill reveal reveal-delay-2">{analysis.style}</span>
            </div>
          </>
        )}

        <p className="results-section-kicker reveal reveal-delay-1">Suggested Pieces</p>
        <div className="suggestions-row">
          {suggestions?.map((s, i) => (
            <article
              key={i}
              className={`suggestion-card reveal reveal-delay-${Math.min(i + 1, 3)}`}
            >
              <h3>{s.item}</h3>
              <p className="suggestion-meta">
                {s.color}
                {s.style ? ` · ${s.style}` : ''}
              </p>
              {!s.products?.length && <p>No product listings available for this piece.</p>}
              {s.products && s.products.length > 0 && (
                <>
                  <p className="shop-label">Shop Secondhand</p>
                  {s.products.map((p, j) => (
                    <a
                      key={j}
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="product-card reveal reveal-delay-1"
                    >
                      {p.thumbnail && <img src={p.thumbnail} alt={p.title} className="product-thumb" />}
                      <div className="product-info">
                        <span className="product-title">{p.title}</span>
                        <span className="product-price">{p.price}</span>
                      </div>
                    </a>
                  ))}
                </>
              )}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
