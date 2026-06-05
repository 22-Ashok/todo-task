// migrations/1698145000000_init_schema.js

export const up = (pgm) => {
  // 1. USERS TABLE
  pgm.createTable('users', {
    id: 'id', 
    name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(255)', notNull: true, unique: true },
    password: { type: 'text', notNull: true }, 
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // 2. CATEGORIES TABLE
  pgm.createTable('categories', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    name: { type: 'varchar(100)', notNull: true },
  });

  // 3. TODOS TABLE
  pgm.createTable('todos', {
    id: 'id',
    user_id: {
      type: 'integer',
      notNull: true,
      references: '"users"',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    category_id: {
      type: 'integer',
      notNull: false, 
      references: '"categories"',
      onDelete: 'SET NULL', 
      onUpdate: 'CASCADE',
    },
    title: { type: 'varchar(255)', notNull: true },
    description: { type: 'text' },
    priority: { type: 'varchar(20)', default: 'medium' }, 
    is_completed: { type: 'boolean', default: false, notNull: true },
    due_date: { type: 'timestamp' },
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  // Create indexes to speed up lookups
  pgm.createIndex('categories', 'user_id');
  pgm.createIndex('todos', 'user_id');
  pgm.createIndex('todos', 'category_id');
};

export const down = (pgm) => {
  pgm.dropTable('todos');
  pgm.dropTable('categories');
  pgm.dropTable('users');
};