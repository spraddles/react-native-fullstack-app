# Readme

### Quick simulator test:
- `npm run start`  
- hit `i` for iOS  (launches simulator)
- opens app within Expo Go
- make live code changes as hot reload is available

### Full simulator test:
- more realistic test than quick test
- `npm run prebuild`  
- `npm run build:ios`  
- run expo in background terminal (`npx expo start`)  
- in another terminal install app & simulate: `npm run simulate:ios`  
- make live code changes as hot reload is available  

### Build app:  
- `npm run prebuild`  
- `npm run build:ios`
- (more steps for complete build)

### Tips:  
- start metro with no cache: `npx expo start --clear`
- if keyboard doesn't appear in iOS Simulator, select menu > io > connect hardware keyboard & select menu > io > toggle software keyboard  
- clear `xcode` cache with `npm run cache:remove:xcode`  
- seeder only works in Expo Go app not iOS app  
- splash screen only works in iOS app not Expo Go app  
- different keyboard inputs (i.e. text vs. numbers) have different hooks: `onEndEditing` / `onSubmitEditing`  
- if you make router edits you may need to exit & reopen the app to see changes  
- you can't have multiple instances of `metro` running else you'll get app errors  
