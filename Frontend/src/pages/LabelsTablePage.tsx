import { useEffect, useState } from 'react'
import Table from '../components/Table/Table'

import {
  defaultLabelFilterParams,
  Label,
  labelAttributes,
  LabelFilterParams
} from '../models/label'
import Filter from '../components/Filter/Filter'
import useFilter from '../hooks/useFilter'
import useDeleteLabel from '../hooks/useDeleteLabel'

function LabelsTablePage() {
  const labelTableHeaders = ['id', 'product_id', 'last_updated']

  const [filteredData, setFilteredData] = useState<Label[]>([])
  const [activeFilterParams, setActiveFilterParams] =
    useState<LabelFilterParams>(defaultLabelFilterParams)
  const [appliedFilterParams, setAppliedFilterParams] =
    useState<LabelFilterParams>(defaultLabelFilterParams)
  const { isFilterActive, isFilterEmpty } = useFilter(activeFilterParams)

  const { deleteLabel } = useDeleteLabel()

  useEffect(() => {
    const getData = async function (filters: LabelFilterParams) {
      const res = await fetch('http://localhost:7071/api/labels', {
        method: 'POST',
        body: JSON.stringify(filters)
      })
      const data = await res.json()
      console.log(data)
      if (data && data.labels) setFilteredData(data.labels)
    }

    if (isFilterActive() && !isFilterEmpty()) {
      getData(activeFilterParams)
    }
    if (isFilterEmpty() || !isFilterActive()) {
      getData(defaultLabelFilterParams)
    }
  }, [appliedFilterParams])

  function handleApplyFilters(labelFilter: LabelFilterParams): void {
    setAppliedFilterParams(labelFilter)
  }

  return (
    <>
      <Filter
        activeFilterParams={activeFilterParams}
        setActiveFilterParams={setActiveFilterParams}
        attributes={labelAttributes}
        defaultFilterParams={defaultLabelFilterParams}
        handleApplyFilters={handleApplyFilters}
      />
      <Table>
        <Table.Header headers={labelTableHeaders}></Table.Header>
        <Table.Body
          data={filteredData}
          render={label => (
            <Table.Row
              modalName="label-form"
              key={label.id}
              item={label}
              handleDeleteItem={() => deleteLabel(label.id, label.product_id)}
            >
              <div>Hello</div>
            </Table.Row>
          )}
        ></Table.Body>
      </Table>
    </>
  )
}

export default LabelsTablePage
