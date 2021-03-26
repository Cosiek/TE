fs = require('fs');
path = require('path');

processor = require(path.resolve(__dirname, '..', 'src', 'processor.js'))


test('Basic document generation.', () => {
    let sampleInput = fs.readFileSync(path.resolve(__dirname, 'sample_input'), 'utf8');
    let document = processor.getDocument(sampleInput);
    expect(document.nodes.length).toBe(104);

    // count node types
    nodeTypes = {};
    for (node of document.nodes){
        nodeTypeName = node.constructor.name;
        if (nodeTypes[nodeTypeName] === undefined){
            nodeTypes[nodeTypeName] = [];
        }
        nodeTypes[nodeTypeName].push(node);
    }
    expect(nodeTypes['CodeNode'].length).toBe(1);
    expect(nodeTypes['CommentNode'].length).toBe(1);
    expect(nodeTypes['EmptyLineNode'].length).toBe(20);
    expect(nodeTypes['HeaderNode'].length).toBe(22);
    expect(nodeTypes['ParagraphNode'].length).toBe(60);
});
