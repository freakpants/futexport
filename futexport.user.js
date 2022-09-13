// ==UserScript==
// @name         FUT Export Script
// @namespace    http://tampermonkey.net/
// @version      0.1
// @updateURL
// @description
// @match        https://www.ea.com/*/fifa/ultimate-team/web-app/*
// @match        https://www.ea.com/fifa/ultimate-team/web-app/*
// @require     http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @resource    jqUI_CSS  http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/jquery-ui.css
// @resource    IconSet1  http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/images/ui-icons_222222_256x240.png
// @resource    IconSet2  http://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/themes/base/images/ui-icons_454545_256x240.png
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant       GM_xmlhttpRequest
// @grant       GM_download
// @connect     ea.com
// @connect     ea2.com
// @connect     futbin.com
// @connect     amazonaws.com
// @connect     futbin.org
// @connect     localhost
// ==/UserScript==

const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return;
        }
        seen.add(value);
      }
      return value;
    };
  };



const originalView = UTClubSearchResultsView.prototype._generate;

UTClubSearchResultsView.prototype._generate = function () {
  // this is called by the club search when looking for players in your club/concept players to add to a squad

  originalView.call(this);
  setTimeout(() => {
    const listItems = this._list.listRows;
    listItems.forEach((item) => {
        console.log(item);
      GM_xmlhttpRequest({
        method: "POST",
        dataType: "json",
        url: "http://localhost/fut/postItemData.php",
        data: JSON.stringify(item, getCircularReplacer()),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        onload: function (response) {
            console.log(response.responseText);
        },
      });
    });
  }, 500);
}