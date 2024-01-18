class ApiFeatures {
  constructor(mongooseQuery, queryString ) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    }
    return this;
  }

  filter() {
    const queryObject = { ...this.queryString };

    const queryExceptions = ["limit", "page", "sort", "fields", "search"];

    queryExceptions.forEach((item) => delete queryObject[item]);
    const modifyQueryObject = JSON.stringify(queryObject).replace(
      /\b(gte|lte|gt|lt)\b/g,
      (match) => `$${match}`
    );

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(modifyQueryObject));

    return this;
  }

  limit() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");

      this.mongooseQuery = this.mongooseQuery.select(fields);
    }
    return this;
  }

  search(collection) {
    if (this.queryString.search) {
      const keywords = this.queryString.search;
      if (collection === "product") {

        this.mongooseQuery = this.mongooseQuery.find({
          $or: [
            {
              title: { $regex: keywords, $options: "i" },
            },
            {
              description: { $regex: keywords, $options: "i" },
            },
          ],
        });

      } else {
        this.mongooseQuery = this.mongooseQuery.find({name: { $regex: keywords, $options: "i" }});
        this.countDocuments = this.mongooseQuery;
      }

    }
    // console.log(this.mongooseQuery)
    return this;
  }

  paginate(numberOfDocuments) {
    // if(this.countDocuments !== -1){// numberOfDocuments = this.countDocuments;}
        
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const pageEndIndex = page * limit;
    const pagination = {};
    pagination.pages = Math.ceil(numberOfDocuments / limit);
    pagination.currentPage = page;

    if (pageEndIndex < numberOfDocuments) {
      pagination.nextPage = page + 1;
    }

    if (page > 1) {
      pagination.previusPage = page - 1;
    }
    this.pagination = pagination;
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    return this;
  }
}

module.exports = ApiFeatures;
