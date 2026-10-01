<<<<<<< HEAD
=======
import { DataTypes } from "sequelize";
>>>>>>> origin/main
import sequelize from "@/lib/db";

// ── Import ALL models (order matters for associations) ─────
import User from "@/models/User";
<<<<<<< HEAD
import Agent from "@/models/Agent";
=======
>>>>>>> origin/main
import Property from "@/models/Property";
import PropertyImage from "@/models/property_images";
import Inquiry from "@/models/Inquiry";
import SavedProperty from "@/models/SavedProperty";

// ── Associations ───────────────────────────────────────────
<<<<<<< HEAD
Agent.hasMany(Property, { foreignKey: "agent_id", as: "properties" });
Property.belongsTo(Agent, { foreignKey: "agent_id", as: "agent" });

=======
>>>>>>> origin/main
Property.hasMany(PropertyImage, { foreignKey: "property_id", as: "images" });
PropertyImage.belongsTo(Property, { foreignKey: "property_id" });

Property.hasMany(Inquiry, { foreignKey: "property_id", as: "inquiries" });
Inquiry.belongsTo(Property, { foreignKey: "property_id", as: "property" });

Property.hasMany(SavedProperty, { foreignKey: "property_id" });
SavedProperty.belongsTo(Property, { foreignKey: "property_id" });

User.hasMany(SavedProperty, { foreignKey: "user_id" });
SavedProperty.belongsTo(User, { foreignKey: "user_id" });

User.hasMany(Property, { foreignKey: "user_id", as: "listings" });
Property.belongsTo(User, { foreignKey: "user_id", as: "owner" });

// Yeh line add karo existing associations ke saath

// ── Export models (import from here in all routes) ─────────
<<<<<<< HEAD
export { User, Agent, Property, PropertyImage, Inquiry, SavedProperty };
=======
export { User, Property, PropertyImage, Inquiry, SavedProperty };
>>>>>>> origin/main

// ── Sync ───────────────────────────────────────────────────
// IMPORTANT: alter:true use NAHI karte
// users table pe ER_TOO_MANY_KEYS crash karta tha
// Sirf naye tables individually sync karo
let initialized = false;
let initPromise = null;

const NEW_MODELS = [
  User,
<<<<<<< HEAD
  Agent,
=======
>>>>>>> origin/main
  Property,
  PropertyImage,
  Inquiry,
  SavedProperty
];
// const NEW_MODELS = [PropertyImage, Inquiry, SavedProperty];

<<<<<<< HEAD
// async function dbInit() {
//   if (initialized) return;
//   try {
//     await sequelize.authenticate();
//     console.log('✅ MySQL connected!');

//     for (const model of NEW_MODELS) {
//       await model.sync({ force: false }); // CREATE TABLE IF NOT EXISTS
//       console.log('✅ Table ready: ' + model.getTableName());
//     }

//     initialized = true;
//     console.log('✅ DB init complete!');
//   } catch (error) {
//     console.error('❌ DB Error:', error);
//     throw error;
//   }
// }

// export default dbInit;
=======

// ── Auto-migration: purani properties table mein naye columns add karta hai ──
// (sync({force:false}) existing table ko alter nahi karta, isliye ye zaroori hai)
const NEW_PROPERTY_COLUMNS = {
  nearby_landmarks:    { type: DataTypes.TEXT('long'), allowNull: true },
  amenities:           { type: DataTypes.TEXT('long'), allowNull: true },
  property_highlights: { type: DataTypes.TEXT('long'), allowNull: true },
  age_of_property:     { type: DataTypes.STRING(30), allowNull: true },
  furnishing:          { type: DataTypes.STRING(30), allowNull: true },
  transaction_type:    { type: DataTypes.STRING(30), allowNull: true },
  balcony:             { type: DataTypes.INTEGER, allowNull: true },
  total_floors:        { type: DataTypes.INTEGER, allowNull: true },
  parking:             { type: DataTypes.STRING(30), allowNull: true },
  facing:              { type: DataTypes.STRING(30), allowNull: true },
  construction_type:   { type: DataTypes.STRING(40), allowNull: true },
};

async function migrateProperties() {
  const qi = sequelize.getQueryInterface();
  const existing = await qi.describeTable('properties');

  for (const [col, def] of Object.entries(NEW_PROPERTY_COLUMNS)) {
    if (!existing[col]) {
      await qi.addColumn('properties', col, def);
      console.log('✅ Column added: properties.' + col);
    }
  }

  // Purana agent_id column ab use nahi hota — NOT NULL ho to insert fail na ho
  if (existing.agent_id && existing.agent_id.allowNull === false) {
    await qi.changeColumn('properties', 'agent_id', { type: DataTypes.INTEGER, allowNull: true });
  }
}
>>>>>>> origin/main

async function dbInit() {
  // Already initialized
  if (initialized) {
    return;
  }

  // If initialization is already running,
  // wait for the same initialization
  if (initPromise) {
    return initPromise;
  }

  initPromise = (async () => {
    try {
      await sequelize.authenticate();

      console.log('✅ MySQL connected!');

      for (const model of NEW_MODELS) {
        await model.sync({ force: false });

        console.log(
          '✅ Table ready: ' + model.getTableName()
        );
      }

<<<<<<< HEAD
=======
      await migrateProperties();

>>>>>>> origin/main
      initialized = true;

      console.log('✅ DB init complete!');
    } catch (error) {
      console.error('❌ DB Error:', error);
      throw error;
    } finally {
      initPromise = null;
    }
  })();

  return initPromise;
}

export default dbInit;
