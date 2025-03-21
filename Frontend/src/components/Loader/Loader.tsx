import './Loader.scss'

export default function Loader({
  width,
  height
}: {
  width: string
  height: string
}) {
  return <span style={{ width, height }} className="loader"></span>
}
