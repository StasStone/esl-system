const router = require('express').Router()

const { getLabels } = require('../controllers/label-controller.js')

router.param('id', (req, res, next, val) => {
    console.log(val)
    next()
})

router.route('/').get(getLabels)

module.exports = router
