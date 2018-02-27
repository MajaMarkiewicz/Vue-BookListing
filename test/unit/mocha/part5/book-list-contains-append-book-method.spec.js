const fs = require('fs');
const path = require('path');
const assert = require('chai').assert;
const parse5 = require('parse5');
const esquery = require('esquery');
const esprima = require('esprima');

describe('BookList.vue', () => {
  it('should contain a methods call to appendBook @book-list-contains-method-call', () => {
    let file;
    try {
      file = fs.readFileSync(path.join(process.cwd(), 'src/components/BookList.vue'), 'utf8');
    } catch (e) {
      assert(false, 'The BookList component does not exist');
    }
    const document = parse5.parseFragment(file.replace(/\n/g, ''), { locationInfo: true });
    const nodes = document.childNodes;
    const script = nodes.filter(node => node.nodeName === 'script');

    const ast = esprima.parse(script[0].childNodes[0].value, { sourceType: 'module' });
    const methods = esquery(ast, 'Property[key.name=methods]');
    assert(methods.length > 0, 'the methods declaration is not present');

    let results = esquery(methods[0], 'Identifier[name="appendBook"]');
    assert(results.length > 0, 'appendBook method is not defined');

    results = esquery(methods[0], 'Property[key.name="appendBook"] > FunctionExpression > Identifier[name="bookTitle"]');
    assert(results.length > 0, 'bookTitle is not an argument inside the the appendBook Method');

    results = esquery(methods[0], 'Property[key.name="appendBook"] > FunctionExpression > Identifier[name="bookAuthor"]');
    assert(results.length > 0, 'bookAuthor is not an argument inside the the appendBook Method');
  });
});