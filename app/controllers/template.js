'use strict';
const Template = require('../models/template');
const Response = require('../utils/response');
const logger = require('../logger');
exports.templateList = async (ctx)=>{
  const temps = await Template.find({}).sort({ update_at: -1 });
  logger.info({ temps, event: 'terminate' });
  return Response.success(ctx, {
    code: 200,
    data: temps,
    message: 'success'
  });
};

exports.templateCreate = async (ctx)=>{
  const result = await Template.create(ctx.request.body);

  return Response.success(ctx, {
    code: 200,
    data: result,
    message: 'success'
  });
};

exports.templateDetail = async (ctx)=>{
  logger.info({ reuslt: ctx.rquery, event: 'reuslt' });
  const result = await Template.findById({ _id: ctx.query.id });
  if(result) {
    return Response.success(ctx, {
      code: 200,
      data: result,
      message: 'success'
    });
  }else {
    return Response.fail(ctx);
  }
};

exports.templateChange = async (ctx)=>{
  const result = await Template.findByIdAndUpdate({ _id: ctx.params.id }, ctx.request.body, { new: true });
  if(result) {
    return Response.success(ctx, {
      code: 200,
      data: result,
      message: 'success'
    });
  }else {
    return Response.fail(ctx);
  }
};

exports.templateDelate = async (ctx)=>{
  try {
    logger.info({ reuslt: ctx.params.id, event: 'reuslt' });
    await Template.findOneAndDelete({ _id: ctx.params.id });
    return Response.ok(ctx, {
      code: 200,
      message: '删除成功'
    });
  }catch(err) {
    return Response.noContent(ctx);
  }
};
