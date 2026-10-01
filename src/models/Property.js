import { DataTypes } from 'sequelize';
import sequelize from '@/lib/db';

// Array fields ko DB mein JSON string ke roop mein rakhte hain (MySQL/MariaDB dono pe safe)
const listField = (name) => ({
  type: DataTypes.TEXT('long'),
  allowNull: true,
  get() {
    const raw = this.getDataValue(name);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  set(value) {
    const arr = Array.isArray(value) ? value : [];
    this.setDataValue(name, JSON.stringify(arr));
  },
});

const Property = sequelize.define('Property', {
  id:            { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title:         { type: DataTypes.STRING(200), allowNull: false },
  description:   { type: DataTypes.TEXT },
  price:         { type: DataTypes.DECIMAL(12, 2), allowNull: false },
  type:          { type: DataTypes.ENUM('buy', 'sell', 'rent'), allowNull: false },
  property_type: { type: DataTypes.ENUM('apartment', 'house', 'villa', 'plot', 'commercial'), allowNull: false },
  location:      { type: DataTypes.STRING(200), allowNull: false },
  city:          { type: DataTypes.STRING(100), allowNull: false },
  area:          { type: DataTypes.DECIMAL(10, 2) },
  bedrooms:      { type: DataTypes.INTEGER },
  bathrooms:     { type: DataTypes.INTEGER },
  user_id:       { type: DataTypes.INTEGER },        // admin jisne list kiya
  contact_email: { type: DataTypes.STRING(100) },    // admin ka email

  // ── Naye specifications ──
  nearby_landmarks:    listField('nearby_landmarks'),
  amenities:           listField('amenities'),
  property_highlights: listField('property_highlights'),
  age_of_property:     { type: DataTypes.STRING(30) },
  furnishing:          { type: DataTypes.STRING(30) },
  transaction_type:    { type: DataTypes.STRING(30) },
  balcony:             { type: DataTypes.INTEGER },
  total_floors:        { type: DataTypes.INTEGER },
  parking:             { type: DataTypes.STRING(30) },
  facing:              { type: DataTypes.STRING(30) },
  construction_type:   { type: DataTypes.STRING(40) },

  // 'active' = Available
  status:        { type: DataTypes.ENUM('active', 'sold', 'rented'), defaultValue: 'active' },
}, {
  tableName:  'properties',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  false,
});

export default Property;
