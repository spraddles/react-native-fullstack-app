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
- cache: start metro with no cache: `npx expo start --clear`
- cache: clear `xcode` cache with `npm run cache:remove:xcode`  
- keyboard: different keyboard inputs (i.e. text vs. numbers) have different hooks: `onEndEditing` / `onSubmitEditing`  
- simulator: the handling of inputs from the PC / laptop keyboard is different to the simulator software keyboard, so use the simulator native software keyboard instead
- simulator: if keyboard doesn't appear in iOS Simulator, select menu > io > connect hardware keyboard & select menu > io > toggle software keyboard  
- simulator: you can't use real native device features (like phone wallet) in Expo Go app, instead use the device simulator
- expo: splash screen only works in iOS app not Expo Go app  
- expo: you can't have multiple instances of `metro` running else you'll get app errors  
- router: if you make router edits you need to exit & restart the app + expo to see changes  