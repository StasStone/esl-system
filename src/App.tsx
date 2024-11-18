import Table from './components/Table'
import { mockedData } from './mocks/mock-data'
import { mockedHeaders } from './mocks/mock-headers'
import './global.css'

function App() {
  return (
    <div>
      <Table>
        <Table.Header headers={mockedHeaders}></Table.Header>
        <Table.Body
          data={mockedData}
          render={product => <Table.Row product={product} />}
        ></Table.Body>
      </Table>
    </div>
  )
}

export default App
