export const up = (pgm) => {
  pgm.addColumn('categories', {
    icon: {
      type: 'varchar(50)',
    },
    color: {
      type: 'varchar(50)',
    },
    description: {
      type: 'text',
    },
  });
};

export const down = (pgm) => {
  pgm.dropColumn('categories', 'icon');
  pgm.dropColumn('categories', 'color');
  pgm.dropColumn('categories', 'description');
};
