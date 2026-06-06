export const up = (pgm) => {
  // Adds the created_at column to the existing categories table
  pgm.addColumn('categories', {
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });
};

export const down = (pgm) => {
  // Safely removes the column if you run npm run migrate:down
  pgm.dropColumn('categories', 'created_at');
};