import './FormRow.css'

type FormRowProps = {
  label: string
  error: string
  children: any
}

export default function FormRow({ label, error, children }: FormRowProps) {
  return (
    <div className="form-row">
      {label && <Label htmlFor={children.props.id}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </div>
  )
}
