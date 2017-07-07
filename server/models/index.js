import Role from './Role';
import User from './User';
import Document from './Document';

Role.hasMany(User, {
  foreignKey: 'roleId'
});

User.belongsTo(Role, {
  foreignKey: 'roleId'
});

User.hasMany(Document, {
  foreignKey: 'authorId'
});

Document.belongsTo(User, {
  foreignKey: 'authorId'
});

export { Role };
export { User };
export { Document };
