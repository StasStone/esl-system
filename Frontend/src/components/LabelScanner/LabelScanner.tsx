import { useState } from 'react'
import { useEffect } from 'react'
import { QrReader } from 'react-qr-reader'
import Quagga from 'quagga'

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
        function (err) {
          if (err) {
            console.error('Error initializing Quagga:', err)
            return
          }
          Quagga.start()
        }
      )

      Quagga.onDetected(data => {
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
    <div className="p-4 flex flex-col gap-4 items-center">
      <h1 className="text-xl font-bold">QR & Barcode Scanner</h1>
      <Card className="w-full max-w-md p-4">
        <CardContent>
          <h2 className="text-lg font-semibold">Scan QR Code</h2>
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (result) setQrData(result?.text)
            }}
            style={{ width: '100%' }}
          />
        </CardContent>
      </Card>
      {qrData && (
        <Card className="w-full max-w-md p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Scanned QR Data</h2>
            <p>{qrData}</p>
            <Button onClick={() => setIsScanning(true)} className="mt-2">
              Scan Barcode
            </Button>
          </CardContent>
        </Card>
      )}
      {barcodeData && (
        <Card className="w-full max-w-md p-4">
          <CardContent>
            <h2 className="text-lg font-semibold">Scanned Barcode</h2>
            <p>{barcodeData}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
