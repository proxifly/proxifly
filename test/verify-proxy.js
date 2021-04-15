var Proxifly = require('../dist/index.js')

var proxifly = new Proxifly({
  apiKey: 'api_test_Key' // Not required, but having one removes limits (get your key at https://proxifly.com).
});

console.log('Sending...');
// proxifly.verifyProxy({
//   source: 'somiibo',
//   proxy: '',
//   url: 'https://google.com',
//   version: '1.0.0',
//   connectionTime: 30000,
// })
// .then(r => {
//   console.log('This should not pass', r);
// })
// .catch(e => {
//   console.log('This should not pass', e);
// })

// return new Promise(async function(resolve, reject) {
//   for (var i = 0; i < 25; i++) {
//     await proxifly.verifyProxy({
//       source: 'somiibo',
//       proxy: `http://1.2.3.${i}:1234`,
//       url: 'https://google.com',
//       version: '1.0.0',
//       connectionTime: 30000,
//     })
//     .then(r => {
//       console.log('This should pass', r);
//     })
//     .catch(e => {
//       console.log('This should not error', e);
//     })
//   }
// });

function wait (ms) {
  return new Promise(function(resolve, reject) {
    setInterval(function () {
      resolve();
    }, ms || 1);
  });
};


return new Promise(async function(resolve, reject) {
  for (var i = 0; i < 8; i++) {
    let num = i % 2 === 0 ? i : i - 1;
    let proxy = `http://1.2.3.${num}:1234`;
    console.log('---proxy', proxy);
    await proxifly.verifyProxy({
      source: 'somiibo',
      proxy: proxy,
      url: 'https://google.com',
      version: '1.0.0',
      connectionTime: 30000,
      batch: 3,
    })
    .then(r => {
      console.log('Pass');
    })
    .catch(e => {
      console.log('Error');
    })
    await wait(1000);
  }


  let proxy = `http://1.2.3.${0}:1234`;
  console.log('---proxy', proxy);
  await proxifly.verifyProxy({
    source: 'somiibo',
    proxy: proxy,
    url: 'https://google.com',
    version: '1.0.0',
    connectionTime: 30000,
    batch: 3,
  })
  .then(r => {
    console.log('Pass');
  })
  .catch(e => {
    console.log('Error');
  })

  await wait(12000);

  console.log('---proxy', proxy);
  await proxifly.verifyProxy({
    source: 'somiibo',
    proxy: proxy,
    url: 'https://google.com',
    version: '1.0.0',
    connectionTime: 30000,
    batch: 3,
  })
  .then(r => {
    console.log('Pass');
  })
  .catch(e => {
    console.log('Error');
  })


  return resolve()
});
