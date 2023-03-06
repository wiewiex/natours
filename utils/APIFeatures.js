class APIFeatures {
  constructor(mongooseQuery, expressQuery) {
    this.mongooseQuery = mongooseQuery;
    this.expressQuery = expressQuery;
  }

  filter() {
    const queryObj = { ...this.expressQuery };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    const modifiedQueryObj = JSON.parse(queryStr);
    this.mongooseQuery.find(modifiedQueryObj);

    return this;
  }

  sort() {
    if (this.expressQuery.sort) {
      const sortBy = this.expressQuery.sort.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort('-createdAt price');
    }
    return this;
  }

  limitFields() {
    if (this.expressQuery.fields) {
      const selectedFields = this.expressQuery.fields.split(',').join(' ');
      this.mongooseQuery = this.mongooseQuery.select(selectedFields);
    } else {
      this.mongooseQuery.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Number(this.expressQuery.page) || 1;
    const limit = Number(this.expressQuery.limit) || 100;
    const skip = (page - 1) * limit;

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = APIFeatures;
