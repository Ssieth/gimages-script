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
// @version     0.2.3
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_listValues
// @grant       GM_setClipboard
// @grant       GM_xmlhttpRequest
// @grant       GM_getResourceURL
// @grant       GM_registerMenuCommand
// @license     GPL
// @copyright   2023, Ssieth
// ==/UserScript==

/*jshint esversion: 6 */
/* jshint -W083 */

let showSizes = true;

function saveSettings() {
  GM_setValue("showSizes",showSizes);
}

function loadSettings() {
  showSizes = GM_getValue("showSizes", true);
}

function updateURLs_img2() {
  $imgs = $("img[style^='max-width:']");
  $imgs.each(function() {
    $img = $(this);
    let href = $img.attr("src");
    if ($img.attr("ssi-proc") !== 'done') {
      $img.attr("ssi-proc","done");
      $img.click(function(e) {
        e.preventDefault();
        e.stopPropagation();
        window.open(href, '_blank').focus();
      })
    }
  });
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
  updateURLs_img2();
  updateURLs_siteLink();
}

function tick() {
  updateURLs();
}

  function showDims() {
    if (!showSizes) {
      $("div.img-dims p").remove();
      $("div.img-dims").removeClass("img-dims");
    } else {
      // Find all thumbnails & exclude the "already handled" class we set below
      const images = document.querySelectorAll('[data-ow]:not(.img-dims):not([data-ismultirow])');

      // Loop through all thumbnails
      images.forEach((image) => {
        try {
          // Get original width from 'data-ow' attribute
          const width = image.getAttribute('data-ow');

          // Get original height from 'data-oh' attribute
          const height = image.getAttribute('data-oh');

          // Create p tag and insert text
          const dimensionsDiv = document.createElement('p');
          const dimensionsContent = document.createTextNode(width + ' × ' + height);
          dimensionsDiv.appendChild(dimensionsContent);

          // Append everything to thumbnail
          image.children[1].appendChild(dimensionsDiv);

          // Add CSS class to the thumbnail
          image.classList.add('img-dims');

        } catch (error) {
          console.error(error);
        }
      });
    }
  }

  // Initialize new MutationObserver
  const mutationObserver = new MutationObserver(showDims);

  function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    const style = document.createElement('style');
    style.textContent = css;
    head.appendChild(style);
  }

$(document).ready( function() {
  loadSettings();
  GM_registerMenuCommand("Toggle image sizes",function() {
    showSizes = !showSizes;
    saveSettings();
    showDims();
  });
     // Add Google's own CSS used for image dimensions
  addGlobalStyle(`
    .img-dims p {
      position: absolute;
      bottom: 0;
      right: 0;
      margin: 0;
      padding: 4px;
      color: #f1f3f4;
      background-color: rgba(0,0,0,.5);
      border-radius: 2px 0 0 0;
      font-family: Roboto-Medium,Roboto,Arial,sans-serif;
      font-size: 10px;
      line-height: 12px;
    }
  `);
  const targetNode = document.querySelector('div[data-cid="GRID_STATE0"]');
  showDims();
  mutationObserver.observe(targetNode, { childList: true, subtree: true });
  setInterval(function () {
    tick();
  }, 500);
});