const toggleVis = (visible: boolean): import('csstype').Property.Visibility =>
  visible === false ? 'hidden' : 'visible';

async function asyncBuild(array, callback) {
  const returnedValue = {};
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, returnedValue);
  }
  return returnedValue;
}

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function asyncFor(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

async function asyncMap(array, callback) {
  for (let index = 0; index < array.length; index++) {
    array[index] = await callback(array[index], index, array);
  }
  return array;
}

export default { toggleVis, asyncBuild, asyncForEach, asyncFor, asyncMap };
