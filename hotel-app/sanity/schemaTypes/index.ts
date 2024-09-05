import { type SchemaTypeDefinition } from 'sanity'
import booking from '../schemas/booking'
import user from '../schemas/user'
import hotelRoom from '../schemas/hotelRoom'
export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
      booking,
      hotelRoom,
      user,
  ],
}
