import TerserPlugin from 'terser-webpack-plugin';

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          mangle: true, // Shortens variable names
          compress: {
            drop_console: true, // Removes console statements
          },
        },
      }),
    ],
    splitChunks: {
      chunks: 'all', // This will split all chunks into separate files
    },
  },
};
