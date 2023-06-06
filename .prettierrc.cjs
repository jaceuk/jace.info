module.exports = {
  plugins: [require.resolve('prettier-plugin-astro')],
  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
  ],
  useTabs: true,
  singleQuote: true,
  trailingComma: 'none',
  printWidth: 100,
};

