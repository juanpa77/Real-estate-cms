import { buildProperty, buildCollection, buildProperties } from "firecms"
import { nanoid } from 'nanoid'
interface Property {
  propertyOwner: PropertyOwner
  data: PropertyData
  rooms: Rooms
}

type PropertyData = {
  transactionType: string
  price: number
  category: PropertyType
  neighborhood: string
  department: string
  address: string
  description: string
}

type Rooms = Room[]

type PropertyOwner = {
  name: string
  ci: string
  phone: number
  secondaryPhone: number
}

type Room = {
  type: string
  gallery: Gallery[]
}

type Gallery = {
  imagesUrl: string[]
}
type PropertyType = 'Casa' | 'Apartamento'

const propertyOwnerBuilder = () => {
  return buildProperty<PropertyOwner>({
    name: 'Propietario',
    validation: { required: true },
    dataType: 'map',
    properties: {
      name: {
        name: 'Nombre',
        dataType: 'string',
      },
      ci: {
        name: 'C.I',
        dataType: 'string',
      },
      secondaryPhone: {
        name: 'celular',
        dataType: 'number',
      },
      phone: {
        name: 'Teléfono',
        dataType: 'number',
      },
    }
  })
}

const propertyBuilder = () => {
  return buildProperty<PropertyData>({
    name: 'datos',
    dataType: 'map',
    properties: {
      transactionType: {
        dataType: 'string',
        name: 'Tipo de transacción',
        enumValues: {
          sale: 'venta',
          rent: 'alquiler',
        }
      },
      price: {
        name: "Precio",
        validation: { required: true },
        dataType: 'number'
      },
      category: {
        name: 'category',
        validation: { required: true },
        dataType: 'string',
        enumValues: {
          casa: 'Casa',
          apartamento: 'Apartamento',
          localComercial: 'Local Comercial',
          deposito: 'Deposito',
        }
      },
      neighborhood: {
        name: 'barrio',
        validation: { required: true },
        dataType: 'string'
      },
      department: {
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
    }
  })
}

const listOfRooms = buildProperty({
  dataType: "string",
  enumValues: {
    default: 'dormitorio',
    dormitorio: 'dormitorio',
    baño: 'baño',
    cocina: 'cocina',
    comedor: 'comedor',
    garaje: 'garaje',
    living: 'living',
    livingComedor: 'livingComedor',
    exterior: 'exterior',
  },
  defaultValue: "exterior",
});

const roomsPropertyBuilder = () => {
  return buildProperty({
    name: 'Ambientes',
    validation: { required: true },
    dataType: 'array',
    of: ({ values, index }) => {
      return {
        // name: 'type de ambiente',
        dataType: 'map',
        properties: roomPropertyBuilder(values?.rooms[index || 0]?.type)
      }
    }
  })
}

const roomPropertyBuilder = (typeRoom: string | undefined) => {
  return buildProperties<Room>({
    type: listOfRooms,
    gallery: {
      name: 'Galería de imágenes',
      dataType: 'array',
      of: ({ index }) => {
        return {
          name: `${typeRoom} ${(index || 0) + 1}`,
          spreadChildren: true,
          dataType: 'map',
          properties: buildProperties<Gallery>({
            imagesUrl: {
              name: `${typeRoom} ${(index || 0) + 1}`,
              dataType: 'array',
              of: {
                dataType: 'string',
                storage: {
                  storagePath: "images",
                  acceptedFiles: ["image/*"],
                  storeUrl: true
                }
              }
            }
          })
        }
      },
    },
  })
}

export const realEstateCollection = buildCollection<Property>({
  name: "Propiedades",
  path: "Propiedades",
  group: "Inmobiliaria",
  properties: {
    propertyOwner: propertyOwnerBuilder(),
    data: propertyBuilder(),
    rooms: roomsPropertyBuilder(),
  },
  callbacks: {
    onPreSave: (entitySaveProps) => {
      const rooms = entitySaveProps.values.rooms?.map(room => {
        return { ...room, id: nanoid(5) }
      })
      const property = { ...entitySaveProps.values, rooms }
      return property
    },
  },
  permissions: () => ({
    read: true,
    edit: true,
    create: true,
    delete: true
  }),
})
