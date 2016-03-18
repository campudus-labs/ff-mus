module.exports = {

  "env" : {
    "browser" : true,
    "es6" : true,
    "mocha" : true,
    "node" : true
  },

  "parserOptions" : {
    "ecmaVersion" : 6,
    "sourceType" : "module",
    "ecmaFeatures" : {
      "experimentalObjectRestSpread" : true,
      "jsx" : true
    }
  },

  "plugins" : [
    "react"
  ],

  "extends" : "eslint:recommended",

  "rules" : {
    "semi" : 2,
    "indent" : [2, 2],
    "no-console" : 1,
    "no-process-env" : 0,

    // ES6
    "prefer-const" : 1,

    // eslint-plugin-react
    "react/display-name" : 0, // Prevent missing displayName in a React component definition
    "react/jsx-no-undef" : 2, // Disallow undeclared variables in JSX
    "react/jsx-indent" : [2, 2], // 2 spaces intendation in JSX
    "react/jsx-indent-props" : [2, 2], // 2 spaces intendation in JSX for props
    "react/jsx-sort-props" : 0, // Enforce props alphabetical sorting
    "react/jsx-uses-react" : 2, // Prevent React to be incorrectly marked as unused
    "react/jsx-uses-vars" : 2, // Prevent variables used in JSX to be incorrectly marked as unused
    "react/no-did-mount-set-state" : 2, // Prevent usage of setState in componentDidMount
    "react/no-did-update-set-state" : 2, // Prevent usage of setState in componentDidUpdate
    "react/no-multi-comp" : 0, // Prevent multiple component definition per file
    "react/no-unknown-property" : 2, // Prevent usage of unknown DOM property
    "react/prop-types" : 1, // Prevent missing props validation in a React component definition
    "react/react-in-jsx-scope" : 2, // Prevent missing React when using JSX
    "react/self-closing-comp" : 2, // Prevent extra closing tags for components without children
    "react/wrap-multilines" : 2 // Prevent missing parentheses around multilines JSX
  }
};
