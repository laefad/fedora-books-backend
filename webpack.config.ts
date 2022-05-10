import * as path from 'path';
import * as webpack from 'webpack';
import { TsconfigPathsPlugin } from 'tsconfig-paths-webpack-plugin';

const config: webpack.Configuration = {
  target: 'node',
  entry: {
    server: './src/index.ts',
    seed: './prisma/seed.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  // devtool: 'source-map',
  resolve: {
    mainFields: ['main'],
    extensions: ['.ts', '.js'],
    plugins: [
      // Plugin for using aliases from tsconfig paths
      new TsconfigPathsPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader'
          }
        ]
      }
    ]
  }
};

export default config;
