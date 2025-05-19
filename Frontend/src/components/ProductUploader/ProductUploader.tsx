import React, { useState, useEffect } from 'react'
import Papa from 'papaparse'
import './ProductUploader.scss'
import { Product } from '../../models/product'
import useCreateProduct from '../../hooks/useCreateProduct'

const expectedHeaders: (keyof Product)[] = [
  'id',
  'name',
  'price',
  'discount',
  'producer'
]

const ProductUploader = () => {
  const [fileName, setFileName] = useState<string | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [uploadStatus, setUploadStatus] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const { createProduct } = useCreateProduct()

  const validateRow = (row: any): row is Product =>
    expectedHeaders.every(key => key in row && typeof row[key] === 'string')

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null)
    setUploadStatus([])
    const file = e.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    Papa.parse<Product>(file, {
      header: true,
      skipEmptyLines: true,
      complete: results => {
        const validRows = results.data.filter(validateRow)
        if (validRows.length !== results.data.length) {
          setError('Some rows were invalid and were skipped.')
        }
        setProducts(validRows)
      },
      error: err => {
        console.error('Parsing error:', err)
        setError('Could not parse the file.')
      }
    })
  }

  useEffect(() => {
    if (products.length === 0) return

    for (const product of products) {
      product.labels = ['']
      createProduct(product)
    }
  }, [products])

  return (
    <div className="csv-uploader">
      <label className="file-upload">
        <input type="file" accept=".csv" onChange={handleFileUpload} />
        <span>📁 Upload Product CSV</span>
      </label>

      {fileName && (
        <p className="file-name">
          <strong>Uploaded:</strong> {fileName}
        </p>
      )}

      {error && <p className="error-message">{error}</p>}

      {uploadStatus.length > 0 && (
        <div className="upload-status">
          {uploadStatus.map((msg, idx) => (
            <p key={idx}>{msg}</p>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductUploader
