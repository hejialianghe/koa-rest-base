#!/usr/bin/env node

'use strict';

// Load APM on production environment
const config = require('./config');
const apm = require('./connections/apm');
const App = require('./app');
const logger = require('./logger');
const mongoose = require('mongoose');
let db = mongoose.connection;

const app = new App();

function handleError(err, ctx) {
  if (apm.active) {
    apm.captureError(err);
  }

  if (ctx == null) {
    logger.error({ err, event: 'error' }, 'Unhandled exception occured');
  }
}

async function terminate(signal) {
  try {
    await app.terminate();
  } finally {
    logger.info({ signal, event: 'terminate' }, 'App is terminated');
    process.kill(process.pid, signal);
  }
}

// Handle uncaught errors
app.on('error', handleError);

// Start server
if (!module.parent) {
  const server = app.listen(config.port, config.host, () => {
    logger.info({ event: 'execute' }, `API server listening on ${config.host}:${config.port}, in ${config.env}`);
  });
  server.on('error', handleError);

  const errors = ['unhandledRejection', 'uncaughtException'];
  errors.map(error => {
    process.on(error, handleError);
  });

  const signals = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  signals.map(signal => {
    process.once(signal, () => terminate(signal));
  });

  db.on('error', function () {
    logger.error({  event: 'error' }, '数据库连接失败');
  });
  // 监听mogodb是否连接成功
  db.once('open', function () {
    logger.info('数据库连接成功');
  });
}

// Expose app
module.exports = app;
