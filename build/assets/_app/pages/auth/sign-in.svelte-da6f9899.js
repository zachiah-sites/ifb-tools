import{S as t,i as s,s as a,j as e,m as n,o as r,x as o,u as $,v as i,L as c,Q as l,R as u,k as m,n as f,f as g,U as p,d,t as b,g as v}from"../../chunks/vendor-d54525a3.js";import{g as h}from"../../chunks/navigation-20968cc5.js";import{a as w}from"../../chunks/db-5a0eba16.js";import{F as y,a as j,B as k}from"../../chunks/FormField-cc6e7d8b.js";import"../../chunks/singletons-bb9012b7.js";import"../../chunks/supabase-8fb510b0.js";function x(t){let s;return{c(){s=b("Sign In")},l(t){s=v(t,"Sign In")},m(t,a){g(t,s,a)},d(t){t&&d(s)}}}function S(t){let s,a,c,b,v,h,w,y;function S(s){t[4](s)}let I={required:!0,label:"Email",type:"email"};function F(s){t[5](s)}void 0!==t[0]&&(I.value=t[0]),s=new j({props:I}),l.push((()=>u(s,"value",S)));let q={required:!0,label:"Password",type:"password"};return void 0!==t[1]&&(q.value=t[1]),b=new j({props:q}),l.push((()=>u(b,"value",F))),w=new k({props:{type:"submit",$$slots:{default:[x]},$$scope:{ctx:t}}}),{c(){e(s.$$.fragment),c=m(),e(b.$$.fragment),h=m(),e(w.$$.fragment)},l(t){n(s.$$.fragment,t),c=f(t),n(b.$$.fragment,t),h=f(t),n(w.$$.fragment,t)},m(t,a){r(s,t,a),g(t,c,a),r(b,t,a),g(t,h,a),r(w,t,a),y=!0},p(t,e){const n={};!a&&1&e&&(a=!0,n.value=t[0],p((()=>a=!1))),s.$set(n);const r={};!v&&2&e&&(v=!0,r.value=t[1],p((()=>v=!1))),b.$set(r);const o={};128&e&&(o.$$scope={dirty:e,ctx:t}),w.$set(o)},i(t){y||(o(s.$$.fragment,t),o(b.$$.fragment,t),o(w.$$.fragment,t),y=!0)},o(t){$(s.$$.fragment,t),$(b.$$.fragment,t),$(w.$$.fragment,t),y=!1},d(t){i(s,t),t&&d(c),i(b,t),t&&d(h),i(w,t)}}}function I(t){let s,a;return s=new y({props:{error:t[2],title:"Sign In",$$slots:{default:[S]},$$scope:{ctx:t}}}),s.$on("submit",t[6]),{c(){e(s.$$.fragment)},l(t){n(s.$$.fragment,t)},m(t,e){r(s,t,e),a=!0},p(t,[a]){const e={};4&a&&(e.error=t[2]),131&a&&(e.$$scope={dirty:a,ctx:t}),s.$set(e)},i(t){a||(o(s.$$.fragment,t),a=!0)},o(t){$(s.$$.fragment,t),a=!1},d(t){i(s,t)}}}function F(t,s,a){let e;c(t,w,(t=>a(3,e=t)));let n="",r="",o=null;return t.$$.update=()=>{8&t.$$.dirty&&e&&h(localStorage["goto-after-login"]||"/")},[n,r,o,e,function(t){n=t,a(0,n)},function(t){r=t,a(1,r)},async()=>{try{await w.signIn({email:n,password:r}),h(localStorage["goto-after-sign-in"]||"/")}catch(t){a(2,o=t.message)}}]}export default class extends t{constructor(t){super(),s(this,t,F,I,a,{})}}
