//import $ from 'jquery';
import React from 'react';
import getJSON from './utils/getJSON';
import shuffleArray from './utils/shuffleArray';
import SearchIcons from './components/SearchIcons';
import RelatedIcons from './components/RelatedIcons';

// If it's the home page
if(location.pathname === '/') {

}
// If it's a blog post page
// (these all start with `/20` because it's `/:year/:postname` pattern)
else if(location.pathname.indexOf('/20') === 0 ) {
  var el = document.getElementById('related-icons'),
    activePostName = el.getAttribute('data-post-name'),
    activeCategoryId = el.getAttribute('data-category-id'),
    activeCategoryName = el.getAttribute('data-category-name');
  getJSON('/data.json', function(data){
    var icons = data.icons.filter(function(icon){
      return (icon.category === activeCategoryId && icon.title !== activePostName) ? true : false;
    });
    React.render(
      <RelatedIcons
        icons={shuffleArray(icons).slice(0, 12)}
        activeCategoryName={activeCategoryName}
        activeCategoryId={activeCategoryId}
        activePostName={activePostName}
      />,
      el
    );
  });
}
// If it's the search page
else if(location.pathname.indexOf('/search') === 0) {
  // Get the hidden ad if it's there
  var adNode = document.getElementById('carbonads');
  if(adNode) {
    var ad = adNode.outerHTML;
  } else {
    var ad = '';
  }

  // Set the threshold to one less if there's an ad
  var threshold = (ad && ad.length > 0) ? 19 : 20;

  // Load the data & kick off react
  getJSON('/data.json', function(data){
    React.render(
      <SearchIcons
        icons={data.icons}
        site={data.site}
        threshold={threshold}
        ad={ad}
      />,
      document.getElementById('search-container')
    );
  });
}
