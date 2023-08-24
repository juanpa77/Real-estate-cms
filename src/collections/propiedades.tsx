import { buildCollection, buildProperty } from "firecms"

export interface Property {
  price: number
  rooms: number
  bathrooms: number
  category: PropertyType[]
  neighborhood: string
  departments: string
  address: string
  description: string
  main_image: string[];
}

type PropertyType = 'Casa' | 'Apartamento'

export const realEstateCollection = buildCollection<Property>({
  name: "Propiedades",
  path: "Propiedades",
  group: "Inmobiliaria",
  properties: {
    price: {
      name: "Precio",
      validation: { required: true },
      dataType: 'number'
    },
    rooms: {
      name: 'cantidad de habitaciones',
      validation: { required: true },
      dataType: 'number'
    },
    bathrooms: {
      name: 'Nro de baños',
      validation: { required: true },
      dataType: 'number'
    },
    category: {
      name: 'category',
      validation: { required: true },
      dataType: 'array',
      of: {
        dataType: 'string',
        enumValues: {
          casa: 'Casa',
          apartamento: 'Apartamento',
          localComercial: 'Local Comercial',
          deposito: 'Deposito',
        }
      }
    },
    neighborhood: {
      name: 'barrio',
      validation: { required: true },
      dataType: 'string'
    },
    departments: {
      name: 'departamento',
      validation: { required: true },
      dataType: 'string'
    },
    address: {
      name: 'dirección',
      validation: { required: true },
      dataType: 'string'
    },
    description: {
      name: 'descripción',
      validation: { required: true },
      dataType: 'string'
    },
    main_image: buildProperty({ // The `buildProperty` method is a utility function used for type checking
      name: "Imágenes",
      dataType: "array",
      of: {
        dataType: 'string',
        storage: {
          storagePath: "images",
          acceptedFiles: ["image/*"],
          //   metadata: {
          //     cacheControl: "max-age=1000000"
          // }
        }
      }
    }),
  },
  permissions: () => ({
    read: true,
    edit: true,
    create: true,
    delete: true
  }),
})
