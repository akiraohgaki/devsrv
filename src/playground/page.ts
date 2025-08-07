export default `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="format-detection" content="telephone=no, email=no, address=no">

    <title>Playground</title>

    <style>
      :root {
  font-size: 14px;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background-color: #fefefe;
  color: #333333;
  font: 1rem/1.5 system-ui;
}

header,
section {
  margin: 4rem;
}

[data-content='code'],
[data-content='preview'],
[data-content='logs'] {
  margin: 1rem 0;
  padding: 1rem;
  border: 2px solid #cccccc;
  border-radius: 5px;
}

[data-content='code'] {
  background-color: #f8f8f8;
  color: #333333;
  overflow: auto;

  &:has(code:focus) {
    border-color: #0098f1;
  }

  & code {
    display: block;
    outline: none;
  }
}

button[data-action] {
  appearance: none;
  display: inline-block;
  line-height: 1;
  min-width: 6rem;
  margin: 0.2rem;
  padding: 0.5rem 1rem;
  border: 2px solid #cccccc;
  border-radius: 3px;
  background-color: #fefefe;
  color: #333333;
  font-weight: bold;
  vertical-align: middle;
  white-space: nowrap;
  outline: none;
  cursor: pointer;

  &:hover,
  &:focus-visible {
    border-color: #0098f1;
  }

  &:active {
    border-color: #333333;
  }
}

    </style>
  </head>

  <body>
    <header>
      <h1>Playground</h1>
    </header>

    <section>
      <h2>Code</h2>
      <div data-content="code">
        <pre><code contenteditable="true" spellcheck="false">// You can import modules.
//import * as mod from 'http://localhost:3000/mod.bundle.js';

// globalThis.Playground available, for example:
await Playground.test('example', async (t) => {
  await t.step('create button', () => {
    Playground.preview.set('&lt;button&gt;Click me&lt;/button&gt;');
  });

  await t.step('add event listener to button', () => {
    Playground.preview.get('button').addEventListener('click', () => {
      Playground.log('Button clicked!');
    });
  });

  await t.step('the preview content should be logged', () => {
    Playground.log(Playground.preview.get().innerHTML);
  });
});
</code></pre>
      </div>
      <button data-action="code.run">Run</button>
      <button data-action="code.clear">Clear</button>
    </section>

    <section>
      <h2>Preview</h2>
      <div data-content="preview"></div>
      <button data-action="preview.clear">Clear</button>
    </section>

    <section>
      <h2>Logs</h2>
      <div data-content="logs"></div>
      <button data-action="logs.clear">Clear</button>
    </section>

    <script type="module">
      var a=class{#t;constructor(){this.#t=document.querySelector('[data-content="code"] code')}get(){return this.#t.textContent??""}set(t){this.#t.textContent=t}clear(){this.#t.textContent=""}async run(){let t=this.#t.textContent??"",e=URL.createObjectURL(new Blob([t],{type:"text/javascript"}));try{await import(e)}catch(n){console.error(n)}}};var c=class{#t;constructor(){this.#t=document.querySelector('[data-content="preview"]')}get(t){return t?this.#t.querySelector(t):this.#t}set(t){let e=document.createElement("template");if(typeof t=="string")e.innerHTML=t;else if(t instanceof Node)e.content.appendChild(t);else if(t instanceof NodeList)for(let n of Array.from(t))e.content.appendChild(n);else e.textContent=String(t);this.#t.textContent="",this.#t.appendChild(e.content)}clear(){this.#t.textContent=""}};var s=class{#t;constructor(){this.#t=document.querySelector('[data-content="logs"]')}get(){let t=this.#t.querySelectorAll('[data-content="log"]');return Array.from(t).map(e=>e.textContent??"")}add(...t){console.log(...t);let e=t.map(r=>r instanceof Error?r.message:typeof r=="object"&&r!==null?JSON.stringify(r):String(r)).join(" "),n=document.createElement("pre");n.setAttribute("data-content","log"),n.textContent=e,this.#t.appendChild(n)}clear(){this.#t.textContent=""}};var l=new s,d=class i{#t;#e;constructor(t){this.#t={name:"Untitled test",fn:()=>{},parent:this,...t},this.#e={name:this.#t.name,passed:!1,result:void 0,exception:void 0,children:[]},this.#t.parent!==this&&this.#t.parent.state.children.push(this.#e)}get state(){return this.#e}async run(){let t={step:async(e,n)=>await new i({name:e,fn:n,parent:this}).run()};return await Promise.resolve().then(()=>this.#t.fn(t)).then(e=>{this.#e.passed=this.#o(),this.#e.result=e}).catch(e=>{this.#e.passed=!1,this.#e.exception=e}),this.#t.parent===this&&this.#n(this.#e),this.#e.passed}#o(){for(let t of this.#e.children)if(!t.passed)return!1;return!0}#n(t,e=1){l.add("#".repeat(e),t.name,"...",t.passed?"Passed":"Failed"),t.result!==void 0&&l.add("Result:",t.result),t.exception!==void 0&&l.add("Exception:",t.exception);for(let n of t.children)this.#n(n,e+1)}};var p=new a,h=new c,u=new s,o=class{static get code(){return p}static get preview(){return h}static get logs(){return u}static log(...t){u.add(...t)}static async test(t,e){return await new d({name:t,fn:e}).run()}static async sleep(t){await new Promise(e=>{setTimeout(e,t)})}};document.querySelector('[data-action="code.run"]')?.addEventListener("click",async()=>{await o.code.run()});document.querySelector('[data-action="code.clear"]')?.addEventListener("click",()=>{o.code.clear()});document.querySelector('[data-action="preview.clear"]')?.addEventListener("click",()=>{o.preview.clear()});document.querySelector('[data-action="logs.clear"]')?.addEventListener("click",()=>{o.logs.clear()});globalThis.Playground=o;

    </script>
  </body>
</html>
`;
