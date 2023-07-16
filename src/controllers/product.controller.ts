import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
} from '@loopback/rest';
import {product} from '../models';
import {ProductRepository} from '../repositories';

export class ProductController {
  constructor(
    @repository(ProductRepository)
    public productRepository: ProductRepository,
  ) {}

  @authenticate('jwt')
  @post('/products')
  @response(200, {
    description: 'Product model instance',
    content: {'application/json': {schema: getModelSchemaRef(product)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(product, {
            title: 'NewProduct',
            exclude: ['id'],
          }),
        },
      },
    })
    product: Omit<product, 'id'>,
  ): Promise<product> {
    return this.productRepository.create(product);
  }

  @get('/products/count')
  @response(200, {
    description: 'Product model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(product) where?: Where<product>): Promise<Count> {
    return this.productRepository.count(where);
  }

  @get('/products')
  @response(200, {
    description: 'Array of Product model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(product, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(product) filter?: Filter<product>,
  ): Promise<product[]> {
    return this.productRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/products')
  @response(200, {
    description: 'Product PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(product, {partial: true}),
        },
      },
    })
    product: product,
    @param.where(product) where?: Where<product>,
  ): Promise<Count> {
    return this.productRepository.updateAll(product, where);
  }

  @get('/products/{id}')
  @response(200, {
    description: 'Product model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(product, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(product, {exclude: 'where'})
    filter?: FilterExcludingWhere<product>,
  ): Promise<product> {
    return this.productRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/products/{id}')
  @response(204, {
    description: 'Product PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(product, {partial: true}),
        },
      },
    })
    product: product,
  ): Promise<void> {
    await this.productRepository.updateById(id, product);
  }

  @authenticate('jwt')
  @put('/products/{id}')
  @response(204, {
    description: 'Product PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() product: product,
  ): Promise<void> {
    await this.productRepository.replaceById(id, product);
  }

  @authenticate('jwt')
  @del('/products/{id}')
  @response(204, {
    description: 'Product DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.productRepository.deleteById(id);
  }

  @get('/products/priceRange')
  @response(200, {
    description: 'Min value and max value of product price',
  })
  async getPriceRange(): Promise<any> {
    let minValue = 0;
    let maxValue = 0;
    const result = await this.productRepository.execute(
      'SELECT min(price), max(price) from product',
    );
    if (result.length > 0) {
      minValue = result[0]['min(price)'];
      maxValue = result[0]['max(price)'];
    }
    return {min: minValue, max: maxValue};
  }
  @get('/products/category')
  @response(200, {
    description: 'Category of product',
  })
  async getCategory(): Promise<any> {
    return await this.productRepository.execute(
      'select distinct(category) from product',
    );
  }
}
