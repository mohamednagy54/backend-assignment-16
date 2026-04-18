import {
  Model,
  ProjectionType,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

export abstract class AbstractRepository<T> {
  constructor(private _model: Model<T>) {}
  /**
   * @param item is an generic data which passed to db
   * @returns
   */
  public async create(item: Partial<T>) {
    const doc = new this._model(item);
    return doc.save();
  }

  /**
   * @param filter is an generic data which passed to db
   * @param projection is an generic data which passed to db
   * @param options is an generic data which passed to db
   * @returns
   */
  public async getOne(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this._model.findOne(filter, projection, options);
  }

  /**
   * @param filter is an generic data which passed to db
   * @param projection is an generic data which passed to db
   * @param options is an generic data which passed to db
   * @returns
   */

  public async getAll(
    filter: QueryFilter<T>,
    projection?: ProjectionType<T>,
    options?: QueryOptions,
  ) {
    return this._model.find(filter, projection, options);
  }

  /**
   * @param filter is an generic data which passed to db
   * @param update is an generic data which passed to db
   * @param options is an generic data which passed to db
   * @returns
   */
  public async updateOne(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = {},
  ) {
    options.returnDocument = "after";
    return this._model.findOneAndUpdate(filter, update, options);
  }



  public async deleteOne(filter:QueryFilter<T>) { 
    this._model.deleteOne(filter)
  }
  

}
