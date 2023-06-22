import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

export default class User extends Model {
  declare id: number;
  declare username: string;
  declare role: string;
  declare email: string;
  declare password: string;
}

User.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: STRING(35),
    allowNull: false,
  },
  role: {
    type: STRING(30),
    allowNull: false,
  },
  email: {
    type: STRING(20),
    allowNull: false,
  },
  password: {
    type: STRING(12),
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  tableName: 'users',
  timestamps: false,
});
