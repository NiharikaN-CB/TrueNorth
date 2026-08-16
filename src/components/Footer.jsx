const SWATCHES = ['#F7D7CD', '#D79B95', '#984343', '#91BDC2', '#F1E4D9']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-row">
        <div>
          <div className="footer-brand">TrueNorth</div>
          <div className="footer-tag">A calmer way to date.</div>
        </div>
        <div className="swatches" aria-hidden="true">
          {SWATCHES.map((color, i) => (
            <span
              key={color}
              className="swatch"
              style={{
                background: color,
                border: i === SWATCHES.length - 1 ? '1px solid rgba(74,46,40,0.15)' : 'none',
              }}
            />
          ))}
        </div>
        <div className="footer-tag">© 2026 TrueNorth. Made for quieter evenings.</div>
      </div>
    </footer>
  )
}
