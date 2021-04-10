// let blake3

// module.exports = async function loadBlake3() {
//  if (!blake3) blake3 = await import('blake3/browser')
//  return blake3
// }

// TODO make the imports work - try @babel/register

const load = require( 'blake3/browser-async');

load().then(blake3 => {
  console.log(blake3.hash('hello world'));
});