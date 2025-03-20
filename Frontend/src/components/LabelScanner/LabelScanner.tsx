import { useState } from 'react'
import { useEffect } from 'react'
import { QrReader } from 'react-qr-reader'
import Quagga from '@ericblade/quagga2'
import './LabelScanner.scss'

export default function LabelScanner() {
  const [qrData, setQrData] = useState(null)
  const [barcodeData, setBarcodeData] = useState(null)
  const [isScanning, setIsScanning] = useState(false)

  useEffect(() => {
    if (isScanning) {
      Quagga.init(
        {
          inputStream: {
            type: 'LiveStream',
            constraints: {
              width: 640,
              height: 480,
              facingMode: 'environment'
            }
          },
          locator: {
            patchSize: 'medium',
            halfSample: true
          },
          numOfWorkers: 2,
          decoder: {
            readers: ['ean_reader', 'code_128_reader']
          },
          locate: true
        },
        function (err: any) {
          if (err) {
            console.error('Error initializing Quagga:', err)
            return
          }
          Quagga.start()
        }
      )

      Quagga.onDetected((data: any) => {
        setBarcodeData(data.codeResult.code)
        setIsScanning(false)
        Quagga.stop()
      })
    }

    return () => {
      Quagga.stop()
    }
  }, [isScanning])

  return (
    <div className="scanner__container">
      <h1 className="text-xl font-bold">QR & Barcode Scanner</h1>
      <div className="w-full max-w-md p-4">
        <div>
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result: any, error) => {
              if (result) setQrData(result?.text)
            }}
          />
        </div>
      </div>
      {qrData && (
        <div className="scanned-data__container">
          <div>
            <h2 className="scanned-data__title">Scanned QR Data</h2>
            <p>{qrData}</p>
            <button onClick={() => setIsScanning(true)} className="mt-2">
              Scan Barcode
            </button>
          </div>
        </div>
      )}
      {barcodeData && (
        <div className="scanned-data_container">
          <div>
            <h2 className="scanned-data__title">Scanned Barcode</h2>
            <p>{barcodeData}</p>
          </div>
        </div>
      )}
    </div>
  )
}
