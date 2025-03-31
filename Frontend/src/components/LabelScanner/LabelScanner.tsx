import QRScanner from '../QRScanner/QRScanner'
import './LabelScanner.scss'

export default function LabelScanner() {
  return (
    <div className="scanner__container">
      <QRScanner />
    </div>
  )
}
