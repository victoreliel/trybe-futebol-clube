import { Model, INTEGER, STRING } from 'sequelize';
import db from '.';

export default class Team extends Model {
  declare id: number;
  declare teamName: string;
}

Team.init({
  id: {
    type: INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  teamName: {
    type: STRING(40),
    allowNull: false,
  },
}, {
  underscored: true,
  sequelize: db,
  tableName: 'teams',
  timestamps: false,
});
