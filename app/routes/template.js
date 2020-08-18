const Router = require('koa-router');
const templateController = require('../controllers/template');
const router = new Router();

router.prefix('/xhr/v2');

router.get('/templateList', templateController.templateList);

router.post('/templateCreate', templateController.templateCreate);

router.get('/templateDetail', templateController.templateDetail);

router.put('/templateChange/:id', templateController.templateChange);

router.del('/templateDelate/:id', templateController.templateDelate);

module.exports = router;
