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
import useDeleteLabel from '../../hooks/useDeleteLabel'
import EditLabelForm from '../../components/EditLabelForm/EditLabelForm'
import Modal from '../../components/Modal/Modal'
import Pagination from '../../components/Pagination/Pagination'
import Loader from '../../components/Loader/Loader'
import './LabelsTablePage.scss'

function LabelsTablePage() {
  const labelTableHeaders = ['id', 'product_id', 'last_updated']

  const [filteredData, setFilteredData] = useState<Label[]>([])
  const [activeFilterParams, setActiveFilterParams] =
    useState<LabelFilterParams>(defaultLabelFilterParams)
  const [appliedFilterParams, setAppliedFilterParams] =
    useState<LabelFilterParams>(defaultLabelFilterParams)
  const { isFilterActive, isFilterEmpty } = useFilter(activeFilterParams)
  const { deleteLabel } = useDeleteLabel()
  const [continuationToken, setContinuationToken] = useState<string | null>(
    null
  )
  const [previousTokens, setPreviousTokens] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const limit = 10
  const modalName = 'label-form'

  const getData = async function (
    filters: LabelFilterParams,
    token: string | null
  ) {
    setLoading(true)
    const res = await fetch('http://localhost:7071/api/labels', {
      method: 'POST',
      body: JSON.stringify({ filters, limit, continuationToken: token })
    })
    const data = await res.json()
    console.log(data)
    if (data && data.labels) setFilteredData(data.labels)
    setLoading(false)
  }

  useEffect(() => {
    if (isFilterActive() && !isFilterEmpty()) {
      getData(activeFilterParams, null)
    }
    if (isFilterEmpty() || !isFilterActive()) {
      getData(defaultLabelFilterParams, null)
    }
  }, [appliedFilterParams])

  function handleApplyFilters(labelFilter: LabelFilterParams): void {
    setAppliedFilterParams(labelFilter)
    setPreviousTokens([])
    setContinuationToken(null)
  }

  function handleNextPage() {
    if (continuationToken) {
      getData(appliedFilterParams, continuationToken)
    }
  }

  function handlePreviousPage() {
    if (previousTokens.length > 1) {
      const newTokens = [...previousTokens]
      newTokens.pop()
      setPreviousTokens(newTokens)
      getData(appliedFilterParams, newTokens[newTokens.length - 1] || null)
    }
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
      <div className="create-product-container">
        <Modal>
          <Modal.Open opens={modalName}>
            <button className="standard-btn">Add new label</button>
          </Modal.Open>
          <Modal.Window name={modalName}>
            <EditLabelForm label={null} />
          </Modal.Window>
        </Modal>
      </div>
      {loading ? (
        <div className="table__loader">
          <Loader width="1rem" height="1rem" />
        </div>
      ) : (
        <div>
          <Table>
            <Table.Header headers={labelTableHeaders}></Table.Header>
            <Table.Body
              data={filteredData}
              render={label => (
                <Table.Row
                  modalName={modalName}
                  key={label.id}
                  item={label}
                  handleDeleteItem={() =>
                    deleteLabel(label.id, label.product_id)
                  }
                >
                  <EditLabelForm label={label} />
                </Table.Row>
              )}
            ></Table.Body>
          </Table>
          <Pagination
            onNext={handleNextPage}
            onPrev={handlePreviousPage}
            continuationToken={continuationToken}
            previousTokens={previousTokens}
          />
        </div>
      )}
    </>
  )
}

export default LabelsTablePage
