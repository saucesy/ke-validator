import babel from "@rollup/plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import {eslint} from "rollup-plugin-eslint";
import commonjs from "rollup-plugin-commonjs";
import filesize from "rollup-plugin-filesize";
import resolve from "rollup-plugin-node-resolve";

export default {
  input: "src/index.js",
  external: ["validator"],
  output: [
    {
      file: "dist/ke-validator.es.js",
      format: "es",
    },
    {
      file: "dist/ke-validator.cjs.js",
      format: "cjs",
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
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    filesize()
  ],
};
