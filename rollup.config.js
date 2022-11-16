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
      file: "es/index.js",
      format: "es",
    },
    {
      file: "ke-validator.js",
      format: "cjs",
    },
  ],
  plugins: [
    eslint({
      include: ["src/**/*.js"],
    }),
    cleanup({
      comments: /\/\/.*/igm
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
