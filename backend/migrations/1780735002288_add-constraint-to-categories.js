export const up = (pgm) => {
  // Adds the constraint so a user cannot have two categories with the exact same name
  pgm.addConstraint('categories', 'unique_category_per_user', {
    unique: ['name', 'user_id']
  });
};

export const down = (pgm) => {
  // Always write the "down" so you can roll back if needed!
  pgm.dropConstraint('categories', 'unique_category_per_user');
};