const router = require('express').Router()

const {
    getLabels,
    postLabel,
    patchLabel,
    getLabel,
    deleteLabel
} = require('../controllers/label-controller.js')

const checkBody = (req, res, next) => {
    const { body } = req
    if (!body.name || !body.price) {
        return res
            .status(400)
            .json({ status: 'failure', message: 'missing properties' })
    }
    next()
}

router.param('tourId', (req, res, next, val) => {
    console.log(val)
    next()
})

router.route('/').get(getLabels).post(checkBody, postLabel)
router.route('/:tourId').patch(patchLabel).get(getLabel).delete(deleteLabel)

module.exports = router
