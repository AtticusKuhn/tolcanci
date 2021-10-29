const t = require("@babel/types");

module.exports = () => (
    {
        visitor: {
            ImportDeclaration(path) {
                // const v = (s) => path.get("source").get("value").isStringLiteral(s)
                const v = path.node.source.value;
                // console.log("v is", v)
                // path.remove();
                // console.log(v("fs"))
                if (v === "index" || v === "./index" || v === "https" || v === "fs") {
                    // path.node = null;
                    path.remove()
                    // path.replaceWith(
                    //     t.expressionStatement(t.identifier("fakeImport"))
                    // );
                }
                // path.replaceWith(
                //     t.expressionStatement(t.identifier("fakeImport"))
                // );
            },
            Identifier(path) {
                if (path.node.name === "setStaticProps") {
                    // path.parentPath.remove();
                    path.replaceWith(
                        t.expressionStatement(t.identifier("noop"))
                    );

                }
            }
        }
    }
)
