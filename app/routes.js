'use strict';

const Router = require('koa-router');
const miscController = require('./controllers/misc');
const templateRouters = require('./routes/template');

const router = new Router();
router.get('/', miscController.getApiInfo);
router.get('/spec', miscController.getSwaggerSpec);
router.get('/status', miscController.healthcheck);


router.use(templateRouters.routes(), router.allowedMethods());

module.exports = router;
