import{S as t,i as n,s as e,A as o}from"../../chunks/vendor-58648dd5.js";import{g as a}from"../../chunks/navigation-20968cc5.js";import"../../chunks/singletons-bb9012b7.js";var s=function(t,n,e,o){return new(e||(e=Promise))((function(a,s){function r(t){try{c(o.next(t))}catch(n){s(n)}}function i(t){try{c(o.throw(t))}catch(n){s(n)}}function c(t){var n;t.done?a(t.value):(n=t.value,n instanceof e?n:new e((function(t){t(n)}))).then(r,i)}c((o=o.apply(t,n||[])).next())}))};function r({page:t,fetch:n,session:e,context:o}){return s(this,void 0,void 0,(function*(){return["bible","sermons","memory","soulwinning"].includes(t.params.path)?{props:{path:t.params.path}}:void 0}))}function i(t,n,e){let{path:s}=n,r=!1;return o((()=>{e(1,r=!0)})),t.$$set=t=>{"path"in t&&e(0,s=t.path)},t.$$.update=()=>{if(3&t.$$.dirty&&r){const t=localStorage["latest-path-"+s]||`/${s}`;a(t,{replaceState:!0})}},[s,r]}export default class extends t{constructor(t){super(),n(this,t,i,null,e,{path:0})}}export{r as load};