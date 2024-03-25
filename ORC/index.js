const exprees = require('express');
const router = exprees.Router();
const orcRouter = require('./orc');

router.use('/orc',orcRouter);

module.exports = router;