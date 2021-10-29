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
                if (v === "index" || v === "./index" || v === "./src/index" || v === "../src/index") {
                    path.get("source").replaceWith(t.stringLiteral(__dirname + "/src/client.ts"))
                }
                if (v === "https" || v === "fs" || !v.startsWith(".")) {
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
            MemberExpression(path) {
                console.log("name", path.get("property.name").node)
                if (path.get("property.name").node === "setStaticProps") {
                    console.log("it's static props")
                    // console.log("arugments", path.parentPath.get("arguments"))
                    path.parentPath.get("arguments")[0].replaceWith(t.stringLiteral("cheese"))
                    path.get("property").replaceWith(t.identifier("noop"))

                    // console.log("stuff", path.parentPath.get("callee").node)
                    // if (path.parentPath.get("callee").node !== undefined) {
                    //     if (path.parentPath.get("callee.property").node !== undefined) {
                    //         console.log("stuff 2", path.parentPath.get("callee.property.name").node)
                    //         if (path.parentPath.get("callee.property.name").node === "setStaticProps") {
                    //             console.log("removing static props...")
                    //             path.replaceWith(t.stringLiteral("cheese"))
                    //             path.parentPath.get("callee.property").replaceWith(t.identifier("noop"))
                    //             // path.parentPath.remove();
                    //             // path.get("arguments").replaceWith(t.stringLiteral("argumentsYeeted"))
                    //             // console.log("arguments", path.node.arguments)

                    //         }
                    //     }
                    // }
                }
            }
        }
    }
)
