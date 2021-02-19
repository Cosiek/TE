
ESCAPES = {
    '&': "&amp;",
    '<': "&lt;",
    '"': "&quot;",
    "'": "&#039;",
}

function escapeHTML(text){
    return text.replace(/[&<"']/g, function(m){ return ESCAPES[m] });
}

module.exports.escape = escapeHTML;
