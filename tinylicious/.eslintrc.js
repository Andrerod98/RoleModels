

 module.exports = {
    "root":true,
    "extends": [
        "@fluidframework/eslint-config-fluid/eslint7"
    ],
    "parserOptions": {
        "project": "tsconfig.json",
        "tsconfigRootDir": __dirname,
        "sourceType": "module",
      },
    "rules": {
        "@typescript-eslint/no-use-before-define":"off",
        "@typescript-eslint/promise-function-async":"off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "import/no-internal-modules":"off",
        "no-null/no-null": "off",
        "prefer-arrow/prefer-arrow-functions": "off",
        "comma-dangle": "off",
        "@typescript-eslint/comma-dangle": "off"
    }
}
