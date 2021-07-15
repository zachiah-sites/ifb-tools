import { escapeHTML } from './escapeHTML';

export default function copyToClipboard(text: string) {
	const x = window.scrollX,
		y = window.scrollY;
	const el = document.createElement('textarea');
	el.innerHTML = escapeHTML(text);
	el.readOnly = true;
	document.body.appendChild(el);
	el.focus();
	el.select();
	document.execCommand('copy');
	el.remove();
	window.scrollTo(x, y);
}
