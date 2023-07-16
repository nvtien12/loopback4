import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {product, ProductRelations} from '../models';

export class ProductRepository extends DefaultCrudRepository<
  product,
  typeof product.prototype.id,
  ProductRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(product, dataSource);
  }
}
