(function () {
	'use strict';

	// window.console = {
    //     log: function (str) {
    //         var node = document.createTextNode('log: ' + str);
    //         var para = document.createElement("span");
	// 		para.appendChild(node);
	// 		para.appendChild(document.createElement("br"));
    //         document.body.appendChild(para);
    //         // alert(str);
    //     }
    // };

    const doc = document.currentScript.ownerDocument;

	class JLGApp extends circle.Element {
        static get tag() {return 'jlg-app'}
        constructor() {
            super(doc);
        }
    }
	window.customElements.define(JLGApp.tag, JLGApp);


})();