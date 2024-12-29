# Readme

### Build app:  
- `npm run prebuild`  
- `npm run build:ios`

### Quick simulator test:
- `npm run start`  
- hit `i` for iOS  (launches simulator)

### Full simulator test:
- `npm run prebuild`  
- `npm run build:ios`  
- run expo in background terminal (`npx expo start`)  
- in another terminal install app & simulate: `npm run simulate:ios`  
- make live code changes as hot reload is available

### Tips:  
- start metro with no cache: `npx expo start --clear`
- if keyboard doesn't appear in iOS Simulator, select menu > io > connect hardware keyboard & select menu > io > toggle software keyboard
- clear `xcode` cache with `npm run cache:remove:xcode`
