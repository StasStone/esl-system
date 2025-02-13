const mockedData = require('../mocks/mock-data.js')

const getLabels = (req, res) => {
    console.log("GET labels")
    res.status(200).json({
        status: 'success',
        results: mockedData.length,
        data: { labels: mockedData }
    })
}

exports.getLabels = getLabels
