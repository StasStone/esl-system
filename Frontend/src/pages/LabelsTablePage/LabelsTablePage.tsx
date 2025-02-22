import { useEffect, useState } from 'react'
import Table from '../../components/Table/Table'

import {
  defaultLabelFilterParams,
  Label,
  labelAttributes,
  LabelFilterParams
} from '../../models/label'
import Filter from '../../components/Filter/Filter'
import useFilter from '../../hooks/useFilter'

function LabelsTablePage() {
  const labelTableHeaders = ['id', 'product_id', 'last_updated']

  const [filteredData, setFilteredData] = useState<Label[]>([])
  const [activeFilterParams, setActiveFilterParams] =
    useState<LabelFilterParams>(defaultLabelFilterParams)
  const [appliedFilterParams, setAppliedFilterParams] =
    useState<LabelFilterParams>(defaultLabelFilterParams)
  const { isFilterActive, isFilterEmpty } = useFilter(activeFilterParams)

  useEffect(() => {
    const getData = async function (filters: LabelFilterParams) {
      const res = await fetch('http://localhost:7071/api/labels', {
        method: 'POST',
        body: JSON.stringify(filters)
      })
      const data = await res.json()
      setFilteredData(data.labels)
    }

    if (isFilterActive() && !isFilterEmpty()) {
      getData(activeFilterParams)
    }
    if (isFilterEmpty() || !isFilterActive()) {
      getData(defaultLabelFilterParams)
    }
  }, [appliedFilterParams, isFilterActive(), isFilterEmpty()])

  function handleApplyFilters(labelFilter: LabelFilterParams): void {
    setAppliedFilterParams(labelFilter)
  }

  function handleDeleteItem() {
    console.log('item deleted')
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
              key={label.id}
              item={label}
              handleDeleteItem={handleDeleteItem}
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
