// Final screen: the photo, a QR code that opens it on a phone, and download / restart buttons.
export default function QRResult({ result, onRestart }) {
  return (
    <section className="done">
      <img className="final" src={result.dataUrl} alt="Your saved photo" />
      <div className="qr">
        <img src={result.qr} alt="QR code that opens your photo" />
        <h2>Scan to download your photo</h2>
        <p className="url">{result.url}</p>
        <a className="btn" href={result.dataUrl} download="photobooth.png">Download</a>
        <button className="btn alt" onClick={onRestart}>Start over</button>
      </div>
    </section>
  );
}
