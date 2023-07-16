import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    mysql: {
      table: 'product',
      schema: 'my_schema',
      strict: true,
    },
  },
})
export class product extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'number',
    required: true,
  })
  price: number;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'string',
    required: true,
  })
  category: string;

  @property({
    type: 'string',
    required: true,
  })
  image: string;

  @property({
    type: 'date',
  })
  date: string;

  constructor(data?: Partial<product>) {
    super(data);
  }
}

export interface ProductRelations {
  // describe navigational properties here
}

export type ProductWithRelations = product & ProductRelations;
