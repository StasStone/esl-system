const router = require('express').Router()

const {
    getTemplates,
    getTemplate
} = require('../controllers/template-controller.js')

router.param('templateTitle', (req, res, next, val) => {
    next()
})

router.route('/').get(getTemplates)
router.route('/:templateTitle').get(getTemplate)
module.exports = router
