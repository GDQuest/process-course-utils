export type GeneralAttributes = {
	accesskey: string;
	autocapitalize: string;
	autofocus: string;
	class: string;
	contenteditable: string;
	dir: string;
	draggable: string;
	enterkeyhint: string;
	hidden: string;
	id: string;
	inputmode: string;
	is: string;
	itemid: string;
	itemprop: string;
	itemref: string;
	itemscope: string;
	itemtype: string;
	lang: string;
	nonce: string;
	slot: string;
	spellcheck: string;
	style: string;
	tabindex: string;
	title: string;
	translate: string;
	ariaExpanded: "true" | "false";
	ariaControls: string
	ariaLabel: string
	ariaHidden: "true" | "false";
	role: string;
	ariaDescribedby: string;
	ariaLabelledby: string;
	ariaLive: "off" | "polite" | "assertive";
	ariaAtomic: "true" | "false";
	ariaRelevant: "additions" | "removals" | "text" | "all";
	ariaBusy: "true" | "false";
	[key: `data${Uppercase<string>}${string}`]: string
};

export type a = GeneralAttributes & {
	accesskey: string;
	charset: string;
	coords: string;
	download: string;
	href: string;
	hreflang: string;
	name: string;
	ping: string;
	referrerpolicy: string;
	rel: string;
	rev: string;
	shape: string;
	tabindex: string;
	target: string;
	type: string;
};

export type abbr = GeneralAttributes & { title: string };

export type applet = GeneralAttributes & {
	align: string;
	alt: string;
	archive: string;
	code: string;
	codebase: string;
	height: string;
	hspace: string;
	name: string;
	object: string;
	vspace: string;
	width: string;
};

export type area = GeneralAttributes & {
	accesskey: string;
	alt: string;
	coords: string;
	download: string;
	href: string;
	hreflang: string;
	nohref: string;
	ping: string;
	referrerpolicy: string;
	rel: string;
	shape: string;
	tabindex: string;
	target: string;
	type: string;
};

export type audio = GeneralAttributes & {
	autoplay: string;
	controls: string;
	crossorigin: string;
	loop: string;
	muted: string;
	preload: string;
	src: string;
};

export type base = GeneralAttributes & { href: string; target: string };

export type basefont = GeneralAttributes & {
	color: string;
	face: string;
	size: string;
};

export type bdo = GeneralAttributes & { dir: string };

export type blockquote = GeneralAttributes & { cite: string };

export type body = GeneralAttributes & {
	alink: string;
	background: string;
	bgcolor: string;
	link: string;
	text: string;
	vlink: string;
};

export type br = GeneralAttributes & { clear: string };

export type button = GeneralAttributes & {
	accesskey: string;
	autofocus: string;
	disabled: string;
	form: string;
	formaction: string;
	formenctype: string;
	formmethod: string;
	formnovalidate: string;
	formtarget: string;
	name: string;
	tabindex: string;
	type: string;
	value: string;
};

export type canvas = GeneralAttributes & { height: string; width: string };

export type caption = GeneralAttributes & { align: string };

export type col = GeneralAttributes & {
	align: string;
	char: string;
	charoff: string;
	span: string;
	valign: string;
	width: string;
};

export type colgroup = GeneralAttributes & {
	align: string;
	char: string;
	charoff: string;
	span: string;
	valign: string;
	width: string;
};

export type data = GeneralAttributes & { value: string };

export type del = GeneralAttributes & { cite: string; datetime: string };

export type details = GeneralAttributes & { open: string };

export type dfn = GeneralAttributes & { title: string };

export type dialog = GeneralAttributes & { open: string };

export type dir = GeneralAttributes & { compact: string };

export type div = GeneralAttributes & { align: string };

export type dl = GeneralAttributes & { compact: string };

export type embed = GeneralAttributes & {
	height: string;
	src: string;
	type: string;
	width: string;
};

export type fieldset = GeneralAttributes & {
	disabled: string;
	form: string;
	name: string;
};

export type font = GeneralAttributes & {
	color: string;
	face: string;
	size: string;
};

export type form = GeneralAttributes & {
	accept: string;
	string: string;
	action: string;
	autocomplete: string;
	enctype: string;
	method: string;
	name: string;
	novalidate: string;
	target: string;
};

export type frame = GeneralAttributes & {
	frameborder: string;
	longdesc: string;
	marginheight: string;
	marginwidth: string;
	name: string;
	noresize: string;
	scrolling: string;
	src: string;
};

export type frameset = GeneralAttributes & { cols: string; rows: string };

export type h1 = GeneralAttributes & { align: string };

export type h2 = GeneralAttributes & { align: string };

export type h3 = GeneralAttributes & { align: string };

export type h4 = GeneralAttributes & { align: string };

export type h5 = GeneralAttributes & { align: string };

export type h6 = GeneralAttributes & { align: string };

export type head = GeneralAttributes & { profile: string };

export type hr = GeneralAttributes & {
	align: string;
	noshade: string;
	size: string;
	width: string;
};

export type html = GeneralAttributes & { manifest: string; version: string };

export type iframe = GeneralAttributes & {
	align: string;
	allow: string;
	allowfullscreen: string;
	allowpaymentrequest: string;
	allowusermedia: string;
	frameborder: string;
	height: string;
	loading: string;
	longdesc: string;
	marginheight: string;
	marginwidth: string;
	name: string;
	referrerpolicy: string;
	sandbox: string;
	scrolling: string;
	src: string;
	srcdoc: string;
	width: string;
};

export type img = GeneralAttributes & {
	align: string;
	alt: string;
	border: string;
	crossorigin: string;
	decoding: string;
	height: string;
	hspace: string;
	ismap: string;
	loading: string;
	longdesc: string;
	name: string;
	referrerpolicy: string;
	sizes: string;
	src: string;
	srcset: string;
	usemap: string;
	vspace: string;
	width: string;
};

export type input = GeneralAttributes & {
	accept: string;
	accesskey: string;
	align: string;
	alt: string;
	autocomplete: string;
	autofocus: string;
	checked: string;
	dirname: string;
	disabled: string;
	form: string;
	formaction: string;
	formenctype: string;
	formmethod: string;
	formnovalidate: string;
	formtarget: string;
	height: string;
	ismap: string;
	list: string;
	max: string;
	maxlength: string;
	min: string;
	minlength: string;
	multiple: string;
	name: string;
	pattern: string;
	placeholder: string;
	readonly: string;
	required: string;
	size: string;
	src: string;
	step: string;
	tabindex: string;
	title: string;
	type: string;
	usemap: string;
	value: string;
	width: string;
};

export type ins = GeneralAttributes & { cite: string; datetime: string };

export type isindex = GeneralAttributes & { prompt: string };

export type label = GeneralAttributes & {
	accesskey: string;
	for: string;
	form: string;
};

export type legend = GeneralAttributes & { accesskey: string; align: string };

export type li = GeneralAttributes & { type: string; value: string };

export type link = GeneralAttributes & {
	as: string;
	charset: string;
	color: string;
	crossorigin: string;
	disabled: string;
	href: string;
	hreflang: string;
	imagesizes: string;
	imagesrcset: string;
	integrity: string;
	media: string;
	nonce: string;
	referrerpolicy: string;
	rel: string;
	rev: string;
	sizes: string;
	target: string;
	title: string;
	type: string;
};

export type map = GeneralAttributes & { name: string };

export type menu = GeneralAttributes & { compact: string };

export type meta = GeneralAttributes & {
	charset: string;
	content: string;
	string: string;
	name: string;
	scheme: string;
};

export type meter = GeneralAttributes & {
	high: string;
	low: string;
	max: string;
	min: string;
	optimum: string;
	value: string;
};

export type htmlObject = GeneralAttributes & {
	align: string;
	archive: string;
	border: string;
	classid: string;
	codebase: string;
	codetype: string;
	data: string;
	declare: string;
	form: string;
	height: string;
	hspace: string;
	name: string;
	standby: string;
	tabindex: string;
	type: string;
	typemustmatch: string;
	usemap: string;
	vspace: string;
	width: string;
};
// fixme

export type ol = GeneralAttributes & {
	compact: string;
	reversed: string;
	start: string;
	type: string;
};

export type optgroup = GeneralAttributes & { disabled: string; label: string };

export type option = GeneralAttributes & {
	disabled: string;
	label: string;
	selected: string;
	value: string;
};

export type output = GeneralAttributes & {
	for: string;
	form: string;
	name: string;
};

export type p = GeneralAttributes & { align: string };

export type param = GeneralAttributes & {
	name: string;
	type: string;
	value: string;
	valuetype: string;
};

export type pre = GeneralAttributes & { width: string };

export type progress = GeneralAttributes & { max: string; value: string };

export type q = GeneralAttributes & { cite: string };

export type script = GeneralAttributes & {
	async: string;
	charset: string;
	crossorigin: string;
	defer: string;
	integrity: string;
	language: string;
	nomodule: string;
	nonce: string;
	referrerpolicy: string;
	src: string;
	type: string;
};

export type select = GeneralAttributes & {
	autocomplete: string;
	autofocus: string;
	disabled: string;
	form: string;
	multiple: string;
	name: string;
	required: string;
	size: string;
	tabindex: string;
};

export type slot = GeneralAttributes & { name: string };

export type source = GeneralAttributes & {
	media: string;
	sizes: string;
	src: string;
	srcset: string;
	type: string;
};

export type style = GeneralAttributes & {
	media: string;
	nonce: string;
	title: string;
	type: string;
};

export type table = GeneralAttributes & {
	align: string;
	bgcolor: string;
	border: string;
	cellpadding: string;
	cellspacing: string;
	frame: string;
	rules: string;
	summary: string;
	width: string;
};

export type tbody = GeneralAttributes & {
	align: string;
	char: string;
	charoff: string;
	valign: string;
};

export type td = GeneralAttributes & {
	abbr: string;
	align: string;
	axis: string;
	bgcolor: string;
	char: string;
	charoff: string;
	colspan: string;
	headers: string;
	height: string;
	nowrap: string;
	rowspan: string;
	scope: string;
	valign: string;
	width: string;
};

export type textarea = GeneralAttributes & {
	accesskey: string;
	autocomplete: string;
	autofocus: string;
	cols: string;
	dirname: string;
	disabled: string;
	form: string;
	maxlength: string;
	minlength: string;
	name: string;
	placeholder: string;
	readonly: string;
	required: string;
	rows: string;
	tabindex: string;
	wrap: string;
};

export type tfoot = GeneralAttributes & {
	align: string;
	char: string;
	charoff: string;
	valign: string;
};

export type th = GeneralAttributes & {
	abbr: string;
	align: string;
	axis: string;
	bgcolor: string;
	char: string;
	charoff: string;
	colspan: string;
	headers: string;
	height: string;
	nowrap: string;
	rowspan: string;
	scope: string;
	valign: string;
	width: string;
};

export type thead = GeneralAttributes & {
	align: string;
	char: string;
	charoff: string;
	valign: string;
};

export type time = GeneralAttributes & { datetime: string };

export type tr = GeneralAttributes & {
	align: string;
	bgcolor: string;
	char: string;
	charoff: string;
	valign: string;
};

export type track = GeneralAttributes & {
	default: string;
	kind: string;
	label: string;
	src: string;
	srclang: string;
};

export type ul = GeneralAttributes & { compact: string; type: string };

export type video = GeneralAttributes & {
	autoplay: string;
	controls: string;
	crossorigin: string;
	height: string;
	loop: string;
	muted: string;
	playsinline: string;
	poster: string;
	preload: string;
	src: string;
	width: string;
};

export type AttributesKeys =
	| keyof GeneralAttributes
	| keyof a
	| keyof abbr
	| keyof applet
	| keyof area
	| keyof audio
	| keyof base
	| keyof basefont
	| keyof bdo
	| keyof blockquote
	| keyof body
	| keyof br
	| keyof button
	| keyof canvas
	| keyof caption
	| keyof col
	| keyof colgroup
	| keyof data
	| keyof del
	| keyof details
	| keyof dfn
	| keyof dialog
	| keyof dir
	| keyof div
	| keyof dl
	| keyof embed
	| keyof fieldset
	| keyof font
	| keyof form
	| keyof frame
	| keyof frameset
	| keyof h1
	| keyof h2
	| keyof h3
	| keyof h4
	| keyof h5
	| keyof h6
	| keyof head
	| keyof hr
	| keyof html
	| keyof htmlObject
	| keyof iframe
	| keyof label
	| keyof legend
	| keyof li
	| keyof link
	| keyof map
	| keyof menu
	| keyof meta
	| keyof meter
	| keyof ol
	| keyof optgroup
	| keyof option
	| keyof output
	| keyof p
	| keyof param
	| keyof pre
	| keyof progress
	| keyof q
	| keyof script
	| keyof select
	| keyof slot
	| keyof source
	| keyof style
	| keyof table
	| keyof tbody
	| keyof td
	| keyof textarea
	| keyof tfoot
	| keyof th
	| keyof thead
	| keyof time
	| keyof tr
	| keyof track
	| keyof ul
	| keyof video;
