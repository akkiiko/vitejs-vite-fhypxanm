import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

type ErrorMessage = string

export default function App() {
  const [value, setValue] = useState('https://example.com')
  const [qrImage, setQrImage] = useState('')
  const [error, setError] = useState<ErrorMessage>('')
  const [darkColor, setDarkColor] = useState('#123b68')
  const [lightColor, setLightColor] = useState('#ffffff')
  const [size, setSize] = useState(280)

  useEffect(() => {
    let active = true

    const createQr = async () => {
      if (!value.trim()) {
        setQrImage('')
        setError('文字またはURLを入力してください。')
        return
      }

      try {
        const image = await QRCode.toDataURL(value.trim(), {
          width: size,
          margin: 2,
          errorCorrectionLevel: 'H',
          color: {
            dark: `${darkColor}ff`,
            light: `${lightColor}ff`,
          },
        })
        if (active) {
          setQrImage(image)
          setError('')
        }
      } catch {
        if (active) setError('QRコードを作成できませんでした。入力内容をご確認ください。')
      }
    }

    void createQr()
    return () => { active = false }
  }, [value, darkColor, lightColor, size])

  const downloadQr = () => {
    if (!qrImage) return
    const link = document.createElement('a')
    link.href = qrImage
    link.download = 'my-qr-code.png'
    link.click()
  }

  const copyText = async () => {
    if (!value.trim()) return
    try {
      await navigator.clipboard.writeText(value)
      window.alert('入力内容をコピーしました。')
    } catch {
      window.alert('コピーできませんでした。')
    }
  }

  return (
    <main className="page-shell">
      <div className="decor-dot dot-one" />
      <div className="decor-dot dot-two" />
      <header className="topbar">
        <a className="brand" href="#" aria-label="QR Studio ホーム">
          <span className="brand-mark">QR</span>
          <span>QR STUDIO</span>
        </a>
        <span className="top-label">SIMPLE QR GENERATOR</span>
      </header>

      <section className="intro">
        <p className="eyebrow"><span /> QUICK & EASY</p>
        <h1>QRコードを、<br /><em>かんたん作成。</em></h1>
        <p className="lead">URLやテキストを入力するだけ。<br className="mobile-break" />オリジナルQRコードをすぐに作れます。</p>
      </section>

      <section className="generator-card" aria-label="QRコード作成ツール">
        <div className="form-panel">
          <div className="section-heading">
            <span className="step">01</span>
            <div>
              <h2>内容を入力</h2>
              <p>QRコードにしたい文字やURLを入力してください。</p>
            </div>
          </div>

          <label className="field-label" htmlFor="qr-content">テキスト・URL</label>
          <textarea
            id="qr-content"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="https://example.com"
            rows={4}
          />
          <div className="field-footer">
            <span>入力内容はQRコードに変換されます。</span>
            <button className="text-button" type="button" onClick={copyText}>入力内容をコピー</button>
          </div>

          <div className="section-heading settings-heading">
            <span className="step">02</span>
            <div>
              <h2>デザイン設定</h2>
              <p>色とサイズをお好みで調整できます。</p>
            </div>
          </div>

          <div className="color-settings">
            <label className="color-control">
              <span>コードの色</span>
              <span className="color-input-wrap">
                <input type="color" value={darkColor} onChange={(event) => setDarkColor(event.target.value)} />
                <code>{darkColor.toUpperCase()}</code>
              </span>
            </label>
            <label className="color-control">
              <span>背景の色</span>
              <span className="color-input-wrap">
                <input type="color" value={lightColor} onChange={(event) => setLightColor(event.target.value)} />
                <code>{lightColor.toUpperCase()}</code>
              </span>
            </label>
          </div>

          <label className="field-label size-label" htmlFor="qr-size">画像サイズ <strong>{size} × {size}px</strong></label>
          <input
            className="size-slider"
            id="qr-size"
            type="range"
            min="180"
            max="480"
            step="20"
            value={size}
            onChange={(event) => setSize(Number(event.target.value))}
          />
          <div className="range-labels"><span>小さめ 180px</span><span>大きめ 480px</span></div>
        </div>

        <div className="preview-panel">
          <div className="section-heading">
            <span className="step">03</span>
            <div>
              <h2>プレビュー</h2>
              <p>読み取りやすさを確認しましょう。</p>
            </div>
          </div>
          <div className="qr-stage">
            {qrImage ? (
              <img className="qr-image" src={qrImage} alt="作成したQRコード" />
            ) : (
              <div className="qr-placeholder">QR</div>
            )}
          </div>
          {error && <p className="error-message" role="alert">{error}</p>}
          <p className="preview-caption">YOUR QR CODE</p>
          <button className="download-button" type="button" onClick={downloadQr} disabled={!qrImage}>
            <span className="download-icon">↓</span>
            PNG画像をダウンロード
          </button>
          <p className="download-note">スマートフォンなどで読み取ってご利用ください。</p>
        </div>
      </section>

      <footer className="footer">
        <span>QR STUDIO</span>
        <span>Simple tools, smart ideas.</span>
      </footer>
    </main>
  )
}
