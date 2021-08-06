var obj={
 a:"testA",
 b:false,
 bbb:[],
 kk:569,
  c:{
    d:"testD",
    f:[{  
      g:"testG",
      h:{
        hh:927
      }
    }],
    ff:[true,false],
    b:0.236,
    mygod:{test:"test"}
  }
};

const dateRegex = new RegExp(/^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|(([1][26]|[2468][048]|[3579][26])00))))$/g);
//console.log(dateRegex.test(str));

const getItem = (nestedObj, pathArr) => {
    return pathArr.reduce((obj, key) =>
        (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}
function setItem(obj, path, value) {
  const pList = path.split('.');
  const key = pList.pop();
  const pointer = pList.reduce((accumulator, currentValue) => {
    if (accumulator[currentValue] === undefined) accumulator[currentValue] = {};
    return accumulator[currentValue];
  }, obj);
  pointer[key] = value;
  return obj;
}

var path='c.f.0.g'
//cl(setItem(obj, path, 'lady blue II'));
//cl(getItem (obj, path.split('.')));
var patterns={
 object:{"title": "","type": "object","properties": {}},
 arrayofobject:{"type": "array","items": {"title": "","type": "object","properties": {}}},
 arrayofstring:{"type": "array","items": {"title": "","type": "object","properties": {}}},
 arrayofnumber:{"type": "array","items": {"title": "","type": "object","properties": {}}},
 arrayofboolean:{"title": "","enum": ["oui","non"],"required":true},
 arrayEmpty:{"title": "","enum": [],"required":true},
 string:{"title": "","type": "string","required":true},
 number:{"title": "","type": "number","required":true},
 boolean:{"title": "","type": "boolean","required":true},
 enum:{"title": "","enum": [],"required":true}
}
var sch={"schema":{"title": "TEST","type": "object","properties": {}}};

function jsonschema(obj) {
  const paths = [];
  const schema = clone(sch);
  function recurse(obj, current) {
    for (const key in obj) {
      let value = obj[key];
      let typ = Array.isArray(value) ? (value.length === 0 ? 'arrayEmpty' : 'arrayof' + typeof value[0]) : typeof value === 'object' ? 'object' : ['boolean', 'string', 'number'].indexOf(typeof value) > -1 ? typeof value : undefined
      //cl(typ)
      let ptrn = clone(patterns[typ]);
      let pth = current + "." + key;
      pth = pth.replace('root.', '');
      pth = pth.replace('root', '');
      pth = pth.replace('.properties.0', '');
      if (value != undefined) {
        if (value && typeof value === 'object') {
          paths.push({ path: pth, type: typ, pattern: ptrn });
          if (typ === 'arrayofobject' || typ === 'object') { recurse(typ === 'arrayofobject' ? value[0] : value, typ === 'arrayofobject' ? pth + ".items.properties" : typ === 'object' ? pth + ".properties" : pth); }
        } else {
          if (['boolean', 'string', 'number'].indexOf(typeof value) > -1) {
            paths.push({ path: pth, type: typeof value, pattern: ptrn })
          }
        }
      }
    }
  }
  recurse(obj, 'root');
  for (var item in paths) {
    var x = paths[item]
    setItem(schema.schema, "properties." + x.path, clone(x.pattern));
  }
  
    return {paths:paths, schema:schema};
}

var res=jsonschema(obj);
