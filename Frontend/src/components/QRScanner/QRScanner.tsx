import { useState } from 'react'
import QrReader from 'react-web-qr-reader'
import { Label } from '../../models/label'
import './QRScanner.scss'
import { useCreateLabel } from '../../hooks/useCreateLabel'

const QRScanner = () => {
  const delay = 500

  const previewStyle = {
    height: 240,
    width: 320
  }

  const [result, setResult] = useState<Label | null>(null)
  const [error, setError] = useState<string>('')
  const [scanned, setScanned] = useState<boolean>()

  const { createLabel } = useCreateLabel()

  const handleScan = (result: any) => {
    if (result) {
      try {
        const parsedLabelId = JSON.parse(result.chunks[1].text)
        const createdLabel: Label = {
          id: parsedLabelId,
          product_id: '',
          last_updated: 'Just updated'
        }
        setResult(createdLabel)
        setScanned(true)
        createLabel(createdLabel)
      } catch (error: any) {
        setError(error.message)
      }
    }
  }

  const handleError = (error: any) => {
    console.log(error)
    setError('Error scanning the QR code')
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
