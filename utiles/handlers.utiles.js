

const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const ErrorClass = require("./ErrorClass.utiles");
const ApiFeatures = require("./apiFeatures.utiles");

const Review = require("../models/review.model")


exports.createDocument = (Model) =>
  asyncHandler(async (req, res) => {
    
    let data = {};

    // add slug field to req.body if there is name or title
    if (req.body.name) data = { ...req.body, slug: slugify(req.body.name) };
    else if (req.body.title)
      data = { ...req.body, slug: slugify(req.body.title) };
    else data = { ...req.body };
    
    console.log(data)

    const document = await Model.create(data);
    
    res.json({ data: document });
  });

exports.getAll = (Model, name = "not product") =>
  asyncHandler(async (req, res) => {
    const countDocuments = await Model.countDocuments();

    const apiFeatures = new ApiFeatures(Model.find(req.filterObj || {}), req.query)
      .limit()
      .sort()
      .filter()
      .search(name)
      .paginate(countDocuments);

    const documents = await apiFeatures.mongooseQuery;

    res.json({
      result: documents.length,
      pagination: apiFeatures.pagination,
      data: documents,
    });
  });

exports.getDocumentById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    const document = await Model.findById(id);

    if (!document)
      return next(
        new ErrorClass(`there is no document for this id ${id}`, 404)
      );

    res.send({ result: 1, data: document });
  });

exports.updateDocumentById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    let data = {};
    if (req.body.name) data = { ...req.body, slug: slugify(req.body.name) };
    else if (req.body.title)
      data = { ...req.body, slug: slugify(req.body.title) };
    else data = { ...req.body };

    const document = await Model.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!document)
      return next(
        new ErrorClass(`there is no document for this id ${id}`, 404)
      );
        document.save()
    res.send(document);
  });

exports.deleteDocumentById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findOneAndDelete({_id:id},);

    if (!document)
      return next(
        new ErrorClass(`there is no document for this id ${id}`, 404)
      );
  
    res.status(204).send();
  });
