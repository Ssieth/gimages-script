// ==UserScript==
// @name        Google Image Improver
// @namespace   google.image.improver.ssieth.co.uk
// @description Adds extra functionality to Google Images
// @include      https://www.google.tld/*tbm=isch*
// @include      https://www.google.tld/search?tbm=isch*
// @include      https://www.google.co.*/*tbm=isch*
// @include      https://www.google.co.*/search?tbm=isch*
// @match        https://lens.google.com/search*
// @include      https://lens.google.com/search*/
//
// @require     https://code.jquery.com/jquery-3.7.1.min.js
//
// @version     0.1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @license     MIT
// @copyright   2018, Ssieth (https://openuserjs.org//users/Ssieth)
// ==/UserScript==

/*jshint esversion: 6 */
/* jshint -W083 */

function updateURLs_img() {
  $img = $("a[href^='http'] > img[style^='max-width:']").eq(0);
  if ($img.length > 0) {
    $a = $img.parent();
    if ($a.attr("ssi-proc") !== 'done') {
      $a.attr("ssi-proc","done");
      let src = $img.attr("src")
      $a.attr("href",src);
    }
  }
}

function updateURLs_siteLink() {
  let site = "www.google.com"
  let start = "https://" + site + "/url?";
  $siteLink = $("a > h1").parent();
  $siteLink.each(function() {
    let $this = $(this);
    if ($this.attr("ssi-proc") !== 'done'){
      $this.attr("ssi-proc","done");
      let href = $this.attr("href");
      $this.click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, '_blank').focus();
      })
    }
  });
}

function updateURLs() {
  updateURLs_img();
  updateURLs_siteLink();
}

function tick() {
  updateURLs();
}

$(document).ready( function() {
    setInterval(function () {
    tick();
  }, 500);
});
