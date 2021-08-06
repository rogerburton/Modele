
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

function resetOptions (obj) {
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'object') {
            if(key!=="properties"){return resetOptions(obj[key]);}else{obj[key]=undefined}
        }
    });
}

var path='c.f.0.g'
//cl(setItem(obj, path, 'lady blue II'));
//cl(getItem (obj, path.split('.')));
var patterns={
 object:{"title": "","type": "object","properties": {}},
 arrayofobject:{"type": "array","items": {"title": "","type": "object","properties": {}}},
 arrayofstring:{"title": "","enum": [],"required":true},
 arrayofnumber:{"title": "","enum": [],"required":true},
 arrayofboolean:{"title": "","enum": ["oui","non"],"required":true},
 arrayEmpty:{"title": "","enum": [],"required":true},
 date:{"title": "","type": "string","format":"date","required":true},
 string:{"title": "","type": "string","required":true},
 number:{"title": "","type": "number","required":true},
 boolean:{"title": "","type": "boolean","required":true},
 enum:{"title": "","enum": [],"required":true}
}
var sch={"schema":{"title": "TEST","type": "object","properties": {}}};
var opt={"options":{"fields": {}}};

function jsonschema(obj) {
  const paths = [];
  const schema = clone(sch);
  const options = clone(opt);
  function recurse(obj, current) {
    for (const key in obj) {
      let value = obj[key];
      let typ = Array.isArray(value) ? (value.length === 0 ? 'arrayEmpty' : 'arrayof' + typeof value[0]) : typeof value === 'object' ? 'object' : ['boolean', 'string', 'number'].indexOf(typeof value) > -1 ? typeof value : undefined
      typ =  typ.indexOf('date')>-1 || globalRegex.test(value) ? 'date':typ
      let ptrn = clone(patterns[typ]); 
      ptrn.title=key;
      //cl(typ)
      if (['arrayofstring', 'arrayofnumber'].indexOf(typ) > -1 ) {ptrn.enum=value;}
      if (key.indexOf('uuid')>-1 ) {ptrn.default=value;}
      let pth = current + "." + key;
      pth = pth.replace('root.', '').replace('root', '').replace('.properties.0', '');
      // make options
      if (value != undefined) {
        if (value && typeof value === 'object') {
          paths.push({ path: pth, type: typ, pattern: ptrn });
          if (typ === 'arrayofobject' || typ === 'object') { recurse(typ === 'arrayofobject' ? 
                                                                     value[0] : value, typ === 'arrayofobject' ? pth + ".items.properties" : 
                                                                     typ === 'object' ? pth + ".properties" : pth); }
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
    var ptrnopt= clone(x.pattern);
    setItem(schema.schema, "properties." + x.path,ptrnopt);
    ptrnopt= clone(ptrnopt);
    var pth="fields." + x["path"].replaceAll("properties","fields");
    delete ptrnopt["title"];delete ptrnopt["type"];delete ptrnopt["enum"];delete ptrnopt["format"];delete ptrnopt["default"];delete ptrnopt["required"];
    if(ptrnopt.items!== undefined){delete ptrnopt.items["title"];}
    if(ptrnopt.items!== undefined){delete ptrnopt.items["type"];}
    if(ptrnopt.items!== undefined){delete ptrnopt.items["required"];}
     if(ptrnopt.items!== undefined){
       if(ptrnopt.items.properties!== undefined){
         ptrnopt.items.fields=clone(ptrnopt.items.properties);
         ptrnopt.items.properties=undefined;
       }
     }
     if(ptrnopt.properties!== undefined){
       ptrnopt.fields=clone(ptrnopt.properties); 
       ptrnopt.properties=undefined;
     }
    setItem(options.options, pth, ptrnopt);
  }
  
  resetOptions(options.options)
  return {paths:paths, schema:schema, options:options};
}
var identities = ["AAA1","AAA2", "BBB", "CCC","FFF","SMARTPI","SMARTPA","SMARTCOOP","TTT1","TTT2","TTT"];
var identitiesInfos = {
  "AAA1":{},
  "AAA2":{},
  "BBB":{},
  "CCC":{},
  "FFF":{},
  "SMARTPPI":{},
  "SMARTPPA":{},
  "SMARTPCOOP":{},
  "TTT":{},
  "TTT1":{},
  "TTT2":{}
};
  var identityPattern={
    "uuid":"",
    "type":["natural","legal","conventional (EA)"],
    "typeNUMID":["NISS","TVA"],
    "NUMID":"",
    "firstName":"",
    "lastName":"",
    "corporateName":"",
    "hasSmartAccount":["oui","non"]
  }
var ec = ["money for money", "work for money", "goods and services for money", "grants"];

var poc={
      "saga": {
        "uuidsaga": function() {return unikid();}(),
        "partyL": function() {return clone(identities);}(),
        "legalPartyL":"",
        "partyLrole": ["seller", "buyer"],
        "partyR": function() {return clone(identities);}(),
        "legalPartyR":"10/07/2021",
        "partyRrole": "",
        "typesaga": function() {return clone(ec);}(),
      },
      "resources": [{
        "uuidresources": '',
        "partyL": {
          "description": 'description',
          "unit": 'unit',
          "typeresources":"",
          "quantity": 0,
          "delivery": [{
            "deliveryDate": ""
          }]
        },
        "partyR": {
          "description": 'description',
          "unit": 'unit',
          "typeresources":"",
          "quantity": 0,
          "delivery": [{
            "deliveryDate": ""
          }]
        }
      }],
    }


var res=jsonschema(poc);
//json.display(res.paths,"#json","html")
json.display({schema:res.schema.schema,options:res.options.options},"#json","append")











  
  
  
  
