import { buildProperty, buildCollection, buildProperties } from "firecms"
import { nanoid } from 'nanoid'
interface Property {
  propertyOwner: PropertyOwner
  data: PropertyData
  rooms: Rooms
}

type PropertyData = {
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
  id: string
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

const listOfRooms = buildProperty<any>({
  dataType: "string",
  enumValues: {
    default: 'dormitorios',
    dormitorios: 'dormitorios',
    baños: 'baños',
    cocina: 'cocina',
    comedor: 'comedor',
    garaje: 'garaje',
    living: 'living',
    livingComedor: 'livingComedor',
    exterior: 'exterior',
  }
});

const roomsPropertyBuilder = () => {
  return buildProperty({
    name: 'Ambientes',
    validation: { required: true },
    dataType: 'array',
    of: {
      name: 'type de ambiente',
      dataType: 'map',
      properties: roomPropertyBuilder()
    }
  })
}



const roomPropertyBuilder = () => {
  return buildProperties({
    id: {
      name: "Revieifwed",
      // Preview: CustomBooleanPreview
      dataType: 'string',
      // hideFromCollection: true,
      // // readOnly: true,
      defaultValue: 'nanoid(5)'
    },
    type: listOfRooms,
    gallery: () => {
      return ({
        name: 'Galería',
        dataType: 'array',
        of: {
          spreadChildren: true,
          dataType: 'map',
          properties: buildProperties({
            imagesUrl: () => {
              return {
                name: '',
                dataType: 'array',
                of: {
                  name: 'galleria',
                  dataType: 'string',
                  storage: {
                    storagePath: "images",
                    acceptedFiles: ["image/*"],
                    storeUrl: true
                  }
                }
              }
            }
          })
        },
      })
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
