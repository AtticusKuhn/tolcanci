# Tolcanci
Tolcanci is a typescript UI framework inspired my mithril, next.js, and grecha.js
# Example
Here is an example of a Tolcanci project (from /example/example.ts)
```ts
import { a, button, div, makeApplication, p, router, } from "../src/index";
import https from "https"
console.log("[INFO] example program initialized")
const intro = div("welcome to tolcanci, a UI framework")
const temp = div("I am a reusable component")
const comps = div("we allow for reusable components", temp, temp)
const b = button("press me")
const displayCount = (count: number) => div<null>(
    div(`the current count ${count}`),
    div(`the next count wil be ${count + 1}`),
).setCss(`font-size: ${count + 10}px`)
const counterExample = div<number>(
    displayCount,
    b,
)
counterExample.setStaticProps(async () => {
    return 12
})
b.addEventListener("click", () => {
    counterExample.setState(counterExample.state + 1)
})
const getTodos = () => new Promise<string>((resolve) => {
    https.get(`https://jsonplaceholder.typicode.com/todos/1`, res => {
        res.on('data', d =>
            resolve(JSON.parse(d.toString())["title"])
        )
    })
})
const state = div("we allow for stateful components", counterExample)
const staticProps = div<string>("this is a component with static props (generated at build time)",
    (string) => div(string)
)
    .setStaticProps(getTodos)
const style = div("I have style",
    p("and so do I")
).setCss("color:red")
const links = a("we support using links").$href("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
const main = div(
    intro,
    comps,
    state,
    staticProps,
    style,
    links
)
const routes = router({
    "": main,
    "404": div("404 not found"),
    "someStuff": div("stuff")
})
export const app = makeApplication(routes)
```
you can see it deployed at https://eulerthedestroyer.github.io/tolcanci/