import { useState } from 'react'
import LabelFilter from '../../components/Filter/LabelFilter'
import Table from '../../components/Table/Table'
import { mockedData } from '../../mocks/mock-data'
import { mockedHeaders } from '../../mocks/mock-headers'
import { LabelAttributes } from '../../models/label'

import './TablePage.scss'

function TablePage() {
  const [activeFilterParams, setActiveFilterParams] = useState<string[]>([])

  function handleApplyFilterParam(filterParam: string) {
    if (!filterParam) return

    let newFilterParams: string[]

    if (activeFilterParams.includes(filterParam)) {
      newFilterParams = activeFilterParams.filter(
        filter => filter !== filterParam
      )
    } else {
      newFilterParams = [...activeFilterParams, filterParam]
    }
    setActiveFilterParams(newFilterParams)
  }

  return (
    <>
      <div className="filters">
        <div className="filters__container">
          {LabelAttributes.map(labelAttribute => (
            <label key={labelAttribute} className="filter__param">
              <input
                key={labelAttribute}
                onChange={() => handleApplyFilterParam(labelAttribute)}
                type="checkbox"
              />
              <span className="filter__param-checkmark"></span>
              {labelAttribute}
            </label>
          ))}
        </div>
        <LabelFilter attributes={activeFilterParams} />
      </div>
      <Table>
        <Table.Header headers={mockedHeaders}></Table.Header>
        <Table.Body
          data={mockedData}
          render={label => <Table.Row key={label.id} label={label} />}
        ></Table.Body>
      </Table>
    </>
  )
}

export default TablePage
