import { useState } from 'react'
import QrReader from 'react-web-qr-reader'
import { Label } from '../../models/label'
import './QRScanner.scss'

const QRScanner = () => {
  const delay = 500

  const previewStyle = {
    height: 240,
    width: 320
  }

  const [result, setResult] = useState<Label | null>(null)
  const [error, setError] = useState<string>('')
  const [scanned, setScanned] = useState<boolean>()

  const handleScan = (result: any) => {
    if (result) {
      try {
        const parsedData = JSON.parse(result.chunks[1].text)
        setResult(parsedData)
        setScanned(true)
      } catch (error: any) {
        setError(error.message)
      }
    }
  }

  const handleError = (error: any) => {
    console.log(error)
    setError('Error scanning the qr code')
    setScanned(true)
  }

  return (
    <div className="scanner">
      {scanned && !error ? (
        result ? (
          <div className="scanned-data__container">
            <p>{result.id}</p>
            <p>{result.product_id}</p>
            <p>{result.last_updated || 'Newly created'}</p>
          </div>
        ) : (
          <div>No results, Please try again</div>
        )
      ) : (
        <QrReader
          delay={delay}
          style={previewStyle}
          onError={handleError}
          onScan={handleScan}
        />
      )}
    </div>
  )
}

export default QRScanner
