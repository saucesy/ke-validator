import cleanup from "rollup-plugin-cleanup";
import {eslint} from "rollup-plugin-eslint";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";

const name = "ke-validator";

export default {
  input: "src/index.js",
  output: [
    {
      file: `dist/${name}.js`,
      format: "cjs",
    },
    {
      file: `dist/${name}.esm.js`,
      format: "es",
    },
  ],
  plugins: [
    eslint({
      include: ["src/**/*.js"],
    }),
    cleanup({
      comments: /\/\/.*/g,
      // compactComments: false
    }),
    resolve(),
    commonjs({
      include: "node_modules/**",
    }),
    filesize(),
  ],
};
