async function loadComp(compName) {
  return fetch(`/components/${compName}.js`)
  .then(function(response) {
    return response.text();
  }).then(function(e) {
    return new Function(e);
  }).catch(function(ex) {
    console.error(ex)
  })
}

function cpadd(f, acc) {
  if (acc.length == 1)
    return f(acc[0]);
  else return f(cpadd(acc[0], acc.splice(1)));
}

const sLoader = async (toLoad, i) => {
  const cList = await toLoad.map((c) => loadComp(c));
  return cList.reverse().reduce(function (acc, cv) {
    acc = cv(acc, i);
  });
};

const sdict = {
  "u-u-i-d-1": (c) => sLoader(["timer"], c),
  "u-u-i-d-2": (c) =>
    sLoader(["uploader", "uploader-multiloader", "cropper", "vidplayer"], c),
};