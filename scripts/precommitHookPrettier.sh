if [ "$LJN_PRETTIER_STRATEGY" != "check" ]; then
  npx prettier "*/**/*.{js,jsx,ts,tsx,json,rc}" --ignore-path ./.prettierignore --write && git add . && git status
else
  npx prettier "*/**/*.{js,jsx,ts,tsx,json,rc}" --ignore-path ./.prettierignore --check
fi