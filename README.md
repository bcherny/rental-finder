![](https://raw.githubusercontent.com/bcherny/rental-finder/master/screenie.png)

## how to run

```sh
cd client
npm i
npm run gulp
cd ..
npm i
npm start
```

## building for windows

```sh
git clone git@github.com:bcherny/rental-finder.git
cd rental-finder
git fetch origin ny2
git checkout ny2

# build client
cd client
npm install
npm run gulp

# build backend
cd ..
npm install

# run backend
npm start
```

then open http://localhost:4002 in a browser