var e=Object.defineProperty,t=Object.defineProperties,s=Object.getOwnPropertyDescriptors,n=Object.getOwnPropertySymbols,r=Object.prototype.hasOwnProperty,o=Object.prototype.propertyIsEnumerable,a=(t,s,n)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[s]=n;import{S as l,i as c,s as i,D as f,c as h,a as $,d as u,b as p,f as m,E as d,F as g,e as v,t as x,g as b,h as w,J as y,k,n as j,K as E,x as z,u as B,G as C,Q as I,R as O,j as S,m as L,o as N,U as P,v as M,al as T,H as V,w as A,L as D,A as H,l as q,r as _,am as U}from"../../../chunks/vendor-58648dd5.js";import{N as R}from"../../../chunks/Nav-8ac6cff7.js";import{N as W,a as F}from"../../../chunks/NavButton-61c68274.js";import{s as G}from"../../../chunks/supabase-96a69e01.js";import{a as J}from"../../../chunks/db-2be0537e.js";import{M as K}from"../../../chunks/Modal-71963041.js";function Q(e){if("songofsolomon"===e)return"Song of Solomon";let t=e;return(e.startsWith("1")||e.startsWith("2"))&&(t=`${t[0]} ${t.slice(1)}`),` ${t}`.replace(/ ([a-z])/,(e=>e.toUpperCase())).trim()}const X=["genesis","exodus","leviticus","numbers","deuteronomy","joshua","judges","ruth","1samuel","2samuel","1kings","2kings","1chronicles","2chronicles","ezra","nehemiah","esther","job","psalms","proverbs","ecclesiastes","songofsolomon","isaiah","jeremiah","lamentations","ezekiel","daniel","hosea","joel","amos","obadiah","jonah","micah","nahum","habakkuk","zephaniah","haggai","zechariah","malachi","matthew","mark","luke","john","acts","romans","1corinthians","2corinthians","galatians","ephesians","philippians","colossians","1thessalonians","2thessalonians","1timothy","2timothy","titus","philemon","hebrews","james","1peter","2peter","1john","2john","3john","jude","revelation"],Y={genesis:50,exodus:40,leviticus:27,numbers:36,deuteronomy:34,joshua:24,judges:21,ruth:4,"1samuel":31,"2samuel":24,"1kings":22,"2kings":25,"1chronicles":29,"2chronicles":36,ezra:10,nehemiah:13,esther:10,job:42,psalms:150,proverbs:31,ecclesiastes:12,songofsolomon:8,isaiah:66,jeremiah:52,lamentations:5,ezekiel:48,daniel:12,hosea:14,joel:3,amos:9,obadiah:1,jonah:4,micah:7,nahum:3,habakkuk:3,zephaniah:3,haggai:2,zechariah:14,malachi:4,matthew:28,mark:16,luke:24,john:21,acts:28,romans:16,"1corinthians":16,"2corinthians":13,galatians:6,ephesians:6,philippians:4,colossians:4,"1thessalonians":4,"2thessalonians":3,"1timothy":6,"2timothy":4,titus:3,philemon:1,hebrews:13,james:5,"1peter":5,"2peter":3,"1john":5,"2john":1,"3john":1,jude:1,revelation:22};function Z(e){let t,s;return{c(){t=f("svg"),s=f("path"),this.h()},l(e){t=h(e,"svg",{"aria-hidden":!0,focusable:!0,"data-prefix":!0,"data-icon":!0,role:!0,xmlns:!0,viewBox:!0,class:!0},1);var n=$(t);s=h(n,"path",{fill:!0,d:!0},1),$(s).forEach(u),n.forEach(u),this.h()},h(){p(s,"fill","currentColor"),p(s,"d","M320 448v40c0 13.255-10.745 24-24 24H24c-13.255 0-24-10.745-24-24V120c0-13.255 10.745-24 24-24h72v296c0 30.879 25.121 56 56 56h168zm0-344V0H152c-13.255 0-24 10.745-24 24v368c0 13.255 10.745 24 24 24h272c13.255 0 24-10.745 24-24V128H344c-13.2 0-24-10.8-24-24zm120.971-31.029L375.029 7.029A24 24 0 0 0 358.059 0H352v96h96v-6.059a24 24 0 0 0-7.029-16.97z"),p(t,"aria-hidden","true"),p(t,"focusable","false"),p(t,"data-prefix","fas"),p(t,"data-icon","copy"),p(t,"role","img"),p(t,"xmlns","http://www.w3.org/2000/svg"),p(t,"viewBox","0 0 448 512"),p(t,"class",e[0])},m(e,n){m(e,t,n),d(t,s)},p(e,[s]){1&s&&p(t,"class",e[0])},i:g,o:g,d(e){e&&u(t)}}}function ee(e,t,s){let{class:n=""}=t;return e.$$set=e=>{"class"in e&&s(0,n=e.class)},[n]}class te extends l{constructor(e){super(),c(this,e,ee,Z,i,{class:0})}}function se(e){let t,s;return{c(){t=f("svg"),s=f("path"),this.h()},l(e){t=h(e,"svg",{"aria-hidden":!0,focusable:!0,"data-prefix":!0,"data-icon":!0,role:!0,xmlns:!0,viewBox:!0,class:!0},1);var n=$(t);s=h(n,"path",{fill:!0,d:!0},1),$(s).forEach(u),n.forEach(u),this.h()},h(){p(s,"fill","currentColor"),p(s,"d","M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"),p(t,"aria-hidden","true"),p(t,"focusable","false"),p(t,"data-prefix","fas"),p(t,"data-icon","times"),p(t,"role","img"),p(t,"xmlns","http://www.w3.org/2000/svg"),p(t,"viewBox","0 0 352 512"),p(t,"class",e[0])},m(e,n){m(e,t,n),d(t,s)},p(e,[s]){1&s&&p(t,"class",e[0])},i:g,o:g,d(e){e&&u(t)}}}function ne(e,t,s){let{class:n=""}=t;return e.$$set=e=>{"class"in e&&s(0,n=e.class)},[n]}class re extends l{constructor(e){super(),c(this,e,ne,se,i,{class:0})}}function oe(e){let t,s;return{c(){t=f("svg"),s=f("path"),this.h()},l(e){t=h(e,"svg",{"aria-hidden":!0,focusable:!0,"data-prefix":!0,"data-icon":!0,role:!0,xmlns:!0,viewBox:!0,class:!0,style:!0},1);var n=$(t);s=h(n,"path",{fill:!0,d:!0},1),$(s).forEach(u),n.forEach(u),this.h()},h(){p(s,"fill","currentColor"),p(s,"d","M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"),p(t,"aria-hidden","true"),p(t,"focusable","false"),p(t,"data-prefix","fas"),p(t,"data-icon","angle-down"),p(t,"role","img"),p(t,"xmlns","http://www.w3.org/2000/svg"),p(t,"viewBox","0 0 320 512"),p(t,"class",e[0])},m(e,n){m(e,t,n),d(t,s)},p(e,[s]){1&s&&p(t,"class",e[0])},i:g,o:g,d(e){e&&u(t)}}}function ae(e,t,s){let{class:n=""}=t;return e.$$set=e=>{"class"in e&&s(0,n=e.class)},[n]}class le extends l{constructor(e){super(),c(this,e,ae,oe,i,{class:0})}}function ce(e){let t,s;return{c(){t=f("svg"),s=f("path"),this.h()},l(e){t=h(e,"svg",{"aria-hidden":!0,focusable:!0,"data-prefix":!0,"data-icon":!0,role:!0,xmlns:!0,viewBox:!0,class:!0},1);var n=$(t);s=h(n,"path",{fill:!0,d:!0},1),$(s).forEach(u),n.forEach(u),this.h()},h(){p(s,"fill","currentColor"),p(s,"d","M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z"),p(t,"aria-hidden","true"),p(t,"focusable","false"),p(t,"data-prefix","fas"),p(t,"data-icon","angle-left"),p(t,"role","img"),p(t,"xmlns","http://www.w3.org/2000/svg"),p(t,"viewBox","0 0 256 512"),p(t,"class",e[0])},m(e,n){m(e,t,n),d(t,s)},p(e,[s]){1&s&&p(t,"class",e[0])},i:g,o:g,d(e){e&&u(t)}}}function ie(e,t,s){let{class:n=""}=t;return e.$$set=e=>{"class"in e&&s(0,n=e.class)},[n]}class fe extends l{constructor(e){super(),c(this,e,ie,ce,i,{class:0})}}function he(e){let t,s;return{c(){t=f("svg"),s=f("path"),this.h()},l(e){t=h(e,"svg",{"aria-hidden":!0,focusable:!0,"data-prefix":!0,"data-icon":!0,role:!0,xmlns:!0,viewBox:!0,class:!0},1);var n=$(t);s=h(n,"path",{fill:!0,d:!0,class:!0},1),$(s).forEach(u),n.forEach(u),this.h()},h(){p(s,"fill","currentColor"),p(s,"d","M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z"),p(s,"class",""),p(t,"aria-hidden","true"),p(t,"focusable","false"),p(t,"data-prefix","fas"),p(t,"data-icon","angle-right"),p(t,"role","img"),p(t,"xmlns","http://www.w3.org/2000/svg"),p(t,"viewBox","0 0 256 512"),p(t,"class",e[0])},m(e,n){m(e,t,n),d(t,s)},p(e,[s]){1&s&&p(t,"class",e[0])},i:g,o:g,d(e){e&&u(t)}}}function $e(e,t,s){let{class:n=""}=t;return e.$$set=e=>{"class"in e&&s(0,n=e.class)},[n]}class ue extends l{constructor(e){super(),c(this,e,$e,he,i,{class:0})}}function pe(e,t,s){const n=e.slice();return n[6]=t[s],n}function me(e){let t,s,n=e[6].label+"";return{c(){t=v("button"),s=x(n)},l(e){t=h(e,"BUTTON",{});var r=$(t);s=b(r,n),r.forEach(u)},m(e,n){m(e,t,n),d(t,s)},p(e,t){1&t&&n!==(n=e[6].label+"")&&w(s,n)},d(e){e&&u(t)}}}function de(e){let t,s,n,r,o,a,l=e[0],c=[];for(let h=0;h<l.length;h+=1)c[h]=me(pe(e,l,h));const i=e[4].default,f=y(i,e,e[3],null);return{c(){t=v("section"),s=v("div");for(let e=0;e<c.length;e+=1)c[e].c();n=k(),r=v("div"),f&&f.c(),this.h()},l(e){t=h(e,"SECTION",{class:!0});var o=$(t);s=h(o,"DIV",{class:!0});var a=$(s);for(let t=0;t<c.length;t+=1)c[t].l(a);a.forEach(u),n=j(o),r=h(o,"DIV",{class:!0});var l=$(r);f&&f.l(l),l.forEach(u),o.forEach(u),this.h()},h(){p(s,"class","shadow-lg bg-blue-200 rounded-t-2xl p-4 sticky"),p(r,"class","flex-grow p-4 rounded-b-2xl flex"),p(t,"class",o="shadow-2xl rounded-2xl max-w-full  m-auto bg-gray-200 overflow-y-auto max-h-full flex flex-col overflow-x-hidden "+e[1])},m(e,o){m(e,t,o),d(t,s);for(let t=0;t<c.length;t+=1)c[t].m(s,null);d(t,n),d(t,r),f&&f.m(r,null),a=!0},p(e,[n]){if(1&n){let t;for(l=e[0],t=0;t<l.length;t+=1){const r=pe(e,l,t);c[t]?c[t].p(r,n):(c[t]=me(r),c[t].c(),c[t].m(s,null))}for(;t<c.length;t+=1)c[t].d(1);c.length=l.length}f&&f.p&&(!a||8&n)&&E(f,i,e,e[3],a?n:-1,null,null),(!a||2&n&&o!==(o="shadow-2xl rounded-2xl max-w-full  m-auto bg-gray-200 overflow-y-auto max-h-full flex flex-col overflow-x-hidden "+e[1]))&&p(t,"class",o)},i(e){a||(z(f,e),a=!0)},o(e){B(f,e),a=!1},d(e){e&&u(t),C(c,e),f&&f.d(e)}}}function ge(e,t,s){let{$$slots:n={},$$scope:r}=t,{sections:o}=t,{activeSectionId:a}=t,{sizeClasses:l="h-96 w-96"}=t;return e.$$set=e=>{"sections"in e&&s(0,o=e.sections),"activeSectionId"in e&&s(2,a=e.activeSectionId),"sizeClasses"in e&&s(1,l=e.sizeClasses),"$$scope"in e&&s(3,r=e.$$scope)},e.$$.update=()=>{5&e.$$.dirty&&!a&&s(2,a=o[0].id),5&e.$$.dirty&&o.find((e=>e.id==a))},[o,l,a,r,n]}class ve extends l{constructor(e){super(),c(this,e,ge,de,i,{sections:0,activeSectionId:2,sizeClasses:1})}}function xe(e){let t,s;const n=e[1].default,r=y(n,e,e[0],null);return{c(){t=v("section"),r&&r.c(),this.h()},l(e){t=h(e,"SECTION",{class:!0});var s=$(t);r&&r.l(s),s.forEach(u),this.h()},h(){p(t,"class","w-full flex-shrink-0")},m(e,n){m(e,t,n),r&&r.m(t,null),s=!0},p(e,[t]){r&&r.p&&(!s||1&t)&&E(r,n,e,e[0],s?t:-1,null,null)},i(e){s||(z(r,e),s=!0)},o(e){B(r,e),s=!1},d(e){e&&u(t),r&&r.d(e)}}}function be(e,t,s){let{$$slots:n={},$$scope:r}=t;return e.$$set=e=>{"$$scope"in e&&s(0,r=e.$$scope)},[r,n]}class we extends l{constructor(e){super(),c(this,e,be,xe,i,{})}}function ye(e,t,s){const n=e.slice();return n[7]=t[s],n}function ke(e,t,s){const n=e.slice();return n[10]=t[s],n}function je(e){let t,s,n=Q(e[10])+"";return{c(){t=v("button"),s=x(n),this.h()},l(e){t=h(e,"BUTTON",{class:!0});var r=$(t);s=b(r,n),r.forEach(u),this.h()},h(){p(t,"class","w-1/3 p-4 bg-gray-200")},m(e,n){m(e,t,n),d(t,s)},p:g,d(e){e&&u(t)}}}function Ee(e){let t,s=X,n=[];for(let r=0;r<s.length;r+=1)n[r]=je(ke(e,s,r));return{c(){t=v("div");for(let e=0;e<n.length;e+=1)n[e].c();this.h()},l(e){t=h(e,"DIV",{class:!0});var s=$(t);for(let t=0;t<n.length;t+=1)n[t].l(s);s.forEach(u),this.h()},h(){p(t,"class","flex flex-wrap")},m(e,s){m(e,t,s);for(let r=0;r<n.length;r+=1)n[r].m(t,null)},p(e,r){if(0&r){let o;for(s=X,o=0;o<s.length;o+=1){const a=ke(e,s,o);n[o]?n[o].p(a,r):(n[o]=je(a),n[o].c(),n[o].m(t,null))}for(;o<n.length;o+=1)n[o].d(1);n.length=s.length}},d(e){e&&u(t),C(n,e)}}}function ze(e){let t,s,n=e[7]+"";return{c(){t=v("a"),s=x(n),this.h()},l(e){t=h(e,"A",{class:!0});var r=$(t);s=b(r,n),r.forEach(u),this.h()},h(){p(t,"class","w-1/4 p-4 bg-gray-200 text-center")},m(e,n){m(e,t,n),d(t,s)},p(e,t){4&t&&n!==(n=e[7]+"")&&w(s,n)},d(e){e&&u(t)}}}function Be(e){let t,s=e[2],n=[];for(let r=0;r<s.length;r+=1)n[r]=ze(ye(e,s,r));return{c(){t=v("div");for(let e=0;e<n.length;e+=1)n[e].c();this.h()},l(e){t=h(e,"DIV",{class:!0});var s=$(t);for(let t=0;t<n.length;t+=1)n[t].l(s);s.forEach(u),this.h()},h(){p(t,"class","flex flex-wrap")},m(e,s){m(e,t,s);for(let r=0;r<n.length;r+=1)n[r].m(t,null)},p(e,r){if(4&r){let o;for(s=e[2],o=0;o<s.length;o+=1){const a=ye(e,s,o);n[o]?n[o].p(a,r):(n[o]=ze(a),n[o].c(),n[o].m(t,null))}for(;o<n.length;o+=1)n[o].d(1);n.length=s.length}},d(e){e&&u(t),C(n,e)}}}function Ce(e){let t,s,n,r;return t=new we({props:{$$slots:{default:[Ee]},$$scope:{ctx:e}}}),n=new we({props:{$$slots:{default:[Be]},$$scope:{ctx:e}}}),{c(){S(t.$$.fragment),s=k(),S(n.$$.fragment)},l(e){L(t.$$.fragment,e),s=j(e),L(n.$$.fragment,e)},m(e,o){N(t,e,o),m(e,s,o),N(n,e,o),r=!0},p(e,s){const r={};8192&s&&(r.$$scope={dirty:s,ctx:e}),t.$set(r);const o={};8196&s&&(o.$$scope={dirty:s,ctx:e}),n.$set(o)},i(e){r||(z(t.$$.fragment,e),z(n.$$.fragment,e),r=!0)},o(e){B(t.$$.fragment,e),B(n.$$.fragment,e),r=!1},d(e){M(t,e),e&&u(s),M(n,e)}}}function Ie(e){let t,s,n;function r(t){e[4](t)}let o={sizeClasses:"h-full w-full",sections:[{id:"book",label:"Book"},{id:"chapter",label:"Chapter"}],$$slots:{default:[Ce]},$$scope:{ctx:e}};return void 0!==e[1]&&(o.activeSectionId=e[1]),t=new ve({props:o}),I.push((()=>O(t,"activeSectionId",r))),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,s){N(t,e,s),n=!0},p(e,n){const r={};8196&n&&(r.$$scope={dirty:n,ctx:e}),!s&&2&n&&(s=!0,r.activeSectionId=e[1],P((()=>s=!1))),t.$set(r)},i(e){n||(z(t.$$.fragment,e),n=!0)},o(e){B(t.$$.fragment,e),n=!1},d(e){M(t,e)}}}function Oe(e){let t,s,n;function r(t){e[5](t)}let o={$$slots:{default:[Ie]},$$scope:{ctx:e}};return void 0!==e[0]&&(o.open=e[0]),t=new K({props:o}),I.push((()=>O(t,"open",r))),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,s){N(t,e,s),n=!0},p(e,[n]){const r={};8198&n&&(r.$$scope={dirty:n,ctx:e}),!s&&1&n&&(s=!0,r.open=e[0],P((()=>s=!1))),t.$set(r)},i(e){n||(z(t.$$.fragment,e),n=!0)},o(e){B(t.$$.fragment,e),n=!1},d(e){M(t,e)}}}function Se(e,t,s){let n,{open:r}=t,{initialBook:o}=t,a=o,l="book";return e.$$set=e=>{"open"in e&&s(0,r=e.open),"initialBook"in e&&s(3,o=e.initialBook)},s(2,n=new Array(Y[a]).fill(0).map(((e,t)=>t+1))),[r,l,n,o,function(e){l=e,s(1,l)},function(e){r=e,s(0,r)}]}class Le extends l{constructor(e){super(),c(this,e,Se,Oe,i,{open:0,initialBook:3})}}function Ne(e,t,s){const n=e.slice();return n[16]=t[s],n}function Pe(e,t,s){const n=e.slice();return n[19]=t[s],n}function Me(e){let t,s;return t=new fe({props:{class:"h-8"}}),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,n){N(t,e,n),s=!0},p:g,i(e){s||(z(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){M(t,e)}}}function Te(e){let t,s,n,r,o,a,l,c=Q(e[0].book)+"",i=e[0].chapter+"";return a=new le({props:{class:"h-6 ml-2"}}),{c(){t=v("span"),s=x(c),n=k(),r=x(i),o=k(),S(a.$$.fragment),this.h()},l(e){t=h(e,"SPAN",{class:!0});var l=$(t);s=b(l,c),n=j(l),r=b(l,i),l.forEach(u),o=j(e),L(a.$$.fragment,e),this.h()},h(){p(t,"class","mr-4")},m(e,c){m(e,t,c),d(t,s),d(t,n),d(t,r),m(e,o,c),N(a,e,c),l=!0},p(e,t){(!l||1&t)&&c!==(c=Q(e[0].book)+"")&&w(s,c),(!l||1&t)&&i!==(i=e[0].chapter+"")&&w(r,i)},i(e){l||(z(a.$$.fragment,e),l=!0)},o(e){B(a.$$.fragment,e),l=!1},d(e){e&&u(t),e&&u(o),M(a,e)}}}function Ve(e){let t,s;return t=new ue({props:{class:"h-8"}}),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,n){N(t,e,n),s=!0},p:g,i(e){s||(z(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){M(t,e)}}}function Ae(e){let t,s,n,r,o,a;return t=new W({props:{href:"/bible/"+e[0].previous.book+"/"+e[0].previous.chapter,$$slots:{default:[Me]},$$scope:{ctx:e}}}),n=new F({props:{grow:!0,$$slots:{default:[Te]},$$scope:{ctx:e}}}),n.$on("click",e[8]),o=new W({props:{href:"/bible/"+e[0].next.book+"/"+e[0].next.chapter,$$slots:{default:[Ve]},$$scope:{ctx:e}}}),{c(){S(t.$$.fragment),s=k(),S(n.$$.fragment),r=k(),S(o.$$.fragment)},l(e){L(t.$$.fragment,e),s=j(e),L(n.$$.fragment,e),r=j(e),L(o.$$.fragment,e)},m(e,l){N(t,e,l),m(e,s,l),N(n,e,l),m(e,r,l),N(o,e,l),a=!0},p(e,s){const r={};1&s&&(r.href="/bible/"+e[0].previous.book+"/"+e[0].previous.chapter),4194304&s&&(r.$$scope={dirty:s,ctx:e}),t.$set(r);const a={};4194305&s&&(a.$$scope={dirty:s,ctx:e}),n.$set(a);const l={};1&s&&(l.href="/bible/"+e[0].next.book+"/"+e[0].next.chapter),4194304&s&&(l.$$scope={dirty:s,ctx:e}),o.$set(l)},i(e){a||(z(t.$$.fragment,e),z(n.$$.fragment,e),z(o.$$.fragment,e),a=!0)},o(e){B(t.$$.fragment,e),B(n.$$.fragment,e),B(o.$$.fragment,e),a=!1},d(e){M(t,e),e&&u(s),M(n,e),e&&u(r),M(o,e)}}}function De(e){let t,s;return t=new R({props:{posClasses:"top-0",$$slots:{default:[Re]},$$scope:{ctx:e}}}),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,n){N(t,e,n),s=!0},p(e,s){const n={};4194359&s&&(n.$$scope={dirty:s,ctx:e}),t.$set(n)},i(e){s||(z(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){M(t,e)}}}function He(e){let t,s;return t=new re({props:{class:"h-8"}}),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,n){N(t,e,n),s=!0},p:g,i(e){s||(z(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){M(t,e)}}}function qe(e){let t,s;return t=new te({props:{class:"h-8"}}),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,n){N(t,e,n),s=!0},p:g,i(e){s||(z(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){M(t,e)}}}function _e(e){let t,s;return{c(){t=v("div"),s=k(),this.h()},l(e){t=h(e,"DIV",{class:!0,style:!0}),$(t).forEach(u),s=j(e),this.h()},h(){p(t,"class","h-8 w-8 rounded-full"),U(t,"background",e[19])},m(e,n){m(e,t,n),m(e,s,n)},p:g,d(e){e&&u(t),e&&u(s)}}}function Ue(e){let t,s;return t=new F({props:{$$slots:{default:[_e]},$$scope:{ctx:e}}}),t.$on("click",(function(){return e[12](e[19])})),{c(){S(t.$$.fragment)},l(e){L(t.$$.fragment,e)},m(e,n){N(t,e,n),s=!0},p(s,n){e=s;const r={};4194304&n&&(r.$$scope={dirty:n,ctx:e}),t.$set(r)},i(e){s||(z(t.$$.fragment,e),s=!0)},o(e){B(t.$$.fragment,e),s=!1},d(e){M(t,e)}}}function Re(e){let t,s,n,r,o,a;t=new F({props:{$$slots:{default:[He]},$$scope:{ctx:e}}}),t.$on("click",e[10]),n=new F({props:{$$slots:{default:[qe]},$$scope:{ctx:e}}}),n.$on("click",e[11]);let l=e[6],c=[];for(let f=0;f<l.length;f+=1)c[f]=Ue(Pe(e,l,f));const i=e=>B(c[e],1,1,(()=>{c[e]=null}));return{c(){S(t.$$.fragment),s=k(),S(n.$$.fragment),r=k();for(let e=0;e<c.length;e+=1)c[e].c();o=q()},l(e){L(t.$$.fragment,e),s=j(e),L(n.$$.fragment,e),r=j(e);for(let t=0;t<c.length;t+=1)c[t].l(e);o=q()},m(e,l){N(t,e,l),m(e,s,l),N(n,e,l),m(e,r,l);for(let t=0;t<c.length;t+=1)c[t].m(e,l);m(e,o,l),a=!0},p(e,s){const r={};4194304&s&&(r.$$scope={dirty:s,ctx:e}),t.$set(r);const a={};if(4194304&s&&(a.$$scope={dirty:s,ctx:e}),n.$set(a),119&s){let t;for(l=e[6],t=0;t<l.length;t+=1){const n=Pe(e,l,t);c[t]?(c[t].p(n,s),z(c[t],1)):(c[t]=Ue(n),c[t].c(),z(c[t],1),c[t].m(o.parentNode,o))}for(_(),t=l.length;t<c.length;t+=1)i(t);A()}},i(e){if(!a){z(t.$$.fragment,e),z(n.$$.fragment,e);for(let e=0;e<l.length;e+=1)z(c[e]);a=!0}},o(e){B(t.$$.fragment,e),B(n.$$.fragment,e),c=c.filter(Boolean);for(let t=0;t<c.length;t+=1)B(c[t]);a=!1},d(e){M(t,e),e&&u(s),M(n,e),e&&u(r),C(c,e),e&&u(o)}}}function We(e){let t,s,n,r,o,a,l,c,i,f,g=e[16].verse+"",y=e[16].text+"";function E(...t){return e[13](e[16],...t)}function z(){return e[14](e[16])}return{c(){t=v("article"),s=v("h2"),n=x(g),r=k(),o=v("p"),a=x(y),l=k(),this.h()},l(e){t=h(e,"ARTICLE",{class:!0,style:!0});var c=$(t);s=h(c,"H2",{class:!0});var i=$(s);n=b(i,g),i.forEach(u),r=j(c),o=h(c,"P",{class:!0});var f=$(o);a=b(f,y),f.forEach(u),l=j(c),c.forEach(u),this.h()},h(){var n,r;p(s,"class","mr-4 p-2 text-xs bg-gray-200 flex items-center"),p(o,"class","self-center"),p(t,"class","flex p-4 duration-200 cursor-pointer border-2"),p(t,"style",c=(null==(r=null==(n=e[2])?void 0:n.find(E))?void 0:r.formatting)+";"),T(t,"border-black",e[1][e[16].verse]),T(t,"text-gray-600",e[1][e[16].verse]),T(t,"border-transparent",!e[1][e[16].verse])},m(e,c){m(e,t,c),d(t,s),d(s,n),d(t,r),d(t,o),d(o,a),d(t,l),i||(f=V(t,"click",z),i=!0)},p(s,r){var o,l;e=s,1&r&&g!==(g=e[16].verse+"")&&w(n,g),1&r&&y!==(y=e[16].text+"")&&w(a,y),5&r&&c!==(c=(null==(l=null==(o=e[2])?void 0:o.find(E))?void 0:l.formatting)+";")&&p(t,"style",c),3&r&&T(t,"border-black",e[1][e[16].verse]),3&r&&T(t,"text-gray-600",e[1][e[16].verse]),3&r&&T(t,"border-transparent",!e[1][e[16].verse])},d(e){e&&u(t),i=!1,f()}}}function Fe(e){let t,s,n,r,o,a,l,c;function i(t){e[9](t)}t=new R({props:{posClasses:"top-0",$$slots:{default:[Ae]},$$scope:{ctx:e}}});let f={initialBook:e[0].book};void 0!==e[3]&&(f.open=e[3]),n=new Le({props:f}),I.push((()=>O(n,"open",i)));let p=e[4].length>0&&De(e),d=e[0].verses,g=[];for(let h=0;h<d.length;h+=1)g[h]=We(Ne(e,d,h));return{c(){S(t.$$.fragment),s=k(),S(n.$$.fragment),o=k(),p&&p.c(),a=k(),l=v("main");for(let e=0;e<g.length;e+=1)g[e].c()},l(e){L(t.$$.fragment,e),s=j(e),L(n.$$.fragment,e),o=j(e),p&&p.l(e),a=j(e),l=h(e,"MAIN",{});var r=$(l);for(let t=0;t<g.length;t+=1)g[t].l(r);r.forEach(u)},m(e,r){N(t,e,r),m(e,s,r),N(n,e,r),m(e,o,r),p&&p.m(e,r),m(e,a,r),m(e,l,r);for(let t=0;t<g.length;t+=1)g[t].m(l,null);c=!0},p(e,[s]){const o={};4194313&s&&(o.$$scope={dirty:s,ctx:e}),t.$set(o);const c={};if(1&s&&(c.initialBook=e[0].book),!r&&8&s&&(r=!0,c.open=e[3],P((()=>r=!1))),n.$set(c),e[4].length>0?p?(p.p(e,s),16&s&&z(p,1)):(p=De(e),p.c(),z(p,1),p.m(a.parentNode,a)):p&&(_(),B(p,1,1,(()=>{p=null})),A()),7&s){let t;for(d=e[0].verses,t=0;t<d.length;t+=1){const n=Ne(e,d,t);g[t]?g[t].p(n,s):(g[t]=We(n),g[t].c(),g[t].m(l,null))}for(;t<g.length;t+=1)g[t].d(1);g.length=d.length}},i(e){c||(z(t.$$.fragment,e),z(n.$$.fragment,e),z(p),c=!0)},o(e){B(t.$$.fragment,e),B(n.$$.fragment,e),B(p),c=!1},d(e){M(t,e),e&&u(s),M(n,e),e&&u(o),p&&p.d(e),e&&u(a),e&&u(l),C(g,e)}}}var Ge=function(e,t,s,n){return new(s||(s=Promise))((function(r,o){function a(e){try{c(n.next(e))}catch(t){o(t)}}function l(e){try{c(n.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(a,l)}c((n=n.apply(e,t||[])).next())}))};function Je({page:e,fetch:t,session:s,context:n}){return Ge(this,void 0,void 0,(function*(){const{book:s,chapter:n}=e.params,r=yield t(`/api/bible/${s}/${n}.json`);return r.ok?{props:{chapter:yield r.json()}}:{status:r.status,error:new Error("Page not found")}}))}function Ke(e,l,c){let i,f;D(e,J,(e=>c(5,f=e)));var h=this&&this.__awaiter||function(e,t,s,n){return new(s||(s=Promise))((function(r,o){function a(e){try{c(n.next(e))}catch(t){o(t)}}function l(e){try{c(n.throw(e))}catch(t){o(t)}}function c(e){var t;e.done?r(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(a,l)}c((n=n.apply(e,t||[])).next())}))};let{chapter:$}=l,u={};let p,m=!1;H((()=>c(7,m=!0)));let d=!1;return e.$$set=e=>{"chapter"in e&&c(0,$=e.chapter)},e.$$.update=()=>{2&e.$$.dirty&&c(4,i=Object.entries(u).filter((([e,t])=>t)).map((([e,t])=>+e))),129&e.$$.dirty&&m&&h(void 0,void 0,void 0,(function*(){c(2,p=null);const{data:e,error:t}=yield G.from("bible_formatting").select("formatting,verse").filter("book","eq",$.book).filter("chapter","eq",$.chapter);if(t)throw t;c(2,p=e)})),4&e.$$.dirty&&console.log(p)},[$,u,p,d,i,f,["#9adab9","#efc082","#f2a5c4","#f3e482","#8bc5e0"],m,()=>c(3,d=!0),function(e){d=e,c(3,d)},()=>c(1,u={}),()=>{!function(e){const t=window.scrollX,s=window.scrollY,n=document.createElement("textarea");n.innerHTML=e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),n.readOnly=!0,document.body.appendChild(n),n.focus(),n.select(),document.execCommand("copy"),n.remove(),window.scrollTo(t,s)}(i.map((e=>{const t=$.verses[+e-1];return`${Q(t.book)} ${t.chapter}:${t.verse}\n${t.text}\n\n`})).join(""))},async e=>{const t=i.map((t=>({book:$.book,chapter:$.chapter,verse:t,formatting:`background: ${e}`,profile_id:f.id}))),s=await Promise.all(t.map((async e=>{const{error:t}=await G.from("bible_formatting").update(e).eq("book",e.book).eq("chapter",e.chapter).eq("verse",e.verse);let s;return t&&(s=(await G.from("bible_formatting").insert(e)).error),console.log({error:t,error2:s}),s})));if(s.filter((e=>e)).length)throw s;c(2,p=[...Object.entries(u).filter((([e,t])=>t)).map((([t])=>({verse:+t,formatting:`background: ${e}`}))),...p])},(e,t)=>t.verse===e.verse,e=>{return c(1,(l=((e,t)=>{for(var s in t||(t={}))r.call(t,s)&&a(e,s,t[s]);if(n)for(var s of n(t))o.call(t,s)&&a(e,s,t[s]);return e})({},u),i={[e.verse]:!u[e.verse]},u=t(l,s(i))));var l,i}]}export default class extends l{constructor(e){super(),c(this,e,Ke,Fe,i,{chapter:0})}}export{Je as load};
