import './FormRow.scss'

type FormRowProps = {
  label?: string
  error?: string
  children: any
}

export default function FormRow({ label, children, error }: FormRowProps) {
  return (
    <div className="form-row">
      {label && (
        <label className="row-label" htmlFor={children.props.id}>
          {label}
        </label>
      )}
      {children}
      {error && <span className="row-error">{error}</span>}
    </div>
  )
}
