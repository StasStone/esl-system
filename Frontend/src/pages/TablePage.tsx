import Table from '../components/Table/Table'
import { mockedData } from '../mocks/mock-data'
import { mockedHeaders } from '../mocks/mock-headers'

function TablePage() {
  return (
    <Table>
      <Table.Header headers={mockedHeaders}></Table.Header>
      <Table.Body
        data={mockedData}
        render={product => <Table.Row key={product.id} product={product} />}
      ></Table.Body>
    </Table>
  )
}

export default TablePage
