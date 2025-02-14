const mockedTemplates = require('../mocks/mock-templates.js')

const getTemplates = (req, res) => {
    res.status(200).json({
        status: 'success',
        results: mockedTemplates.length,
        data: { templates: mockedTemplates }
    })
}
const getTemplate = (req, res) => {
    const { params } = req
    const { templateTitle } = params
    console.log(templateTitle)
    const template = mockedTemplates.find((template) => template.title === templateTitle)
    res.status(200).json({
        status: 'success',
        data: { template }
    })
}

exports.getTemplates = getTemplates
exports.getTemplate = getTemplate
