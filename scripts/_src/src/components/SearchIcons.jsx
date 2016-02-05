import React from 'react';
import IconList from './IconList';
import IconFilters from './IconFilters';
import 'string_score';
import scrollTo from '../utils/scrollTo';

var SearchIcons = React.createClass({

  propTypes: {
    icons: React.PropTypes.array.isRequired,
    site: React.PropTypes.object.isRequired,
    threshold: React.PropTypes.number.isRequired
  },

  getInitialState: function(){
    // Setup intial filters
    var activeFilters = {
      'category': '',
      'color': '',
      'search': ''
    };

    // Check to see if params were passed via URL
    // If they were, set the appropriate filter val
    // function getQueryParams(str) {
    //   return (str || document.location.search).replace(/(^\?)/,'').split("&").map(function(n){return n=n.split("="),this[n[0]]=n[1],this;}.bind({}))[0];
    // };
    // var activeFilters
    var query = location.search.substring(1);
    if(query !== '') {
      query = query.split('=');
      var key = query[0];
      var val = query[1];
      if(key === 'category') {
        activeFilters.category = val;
      } else if(key === 'color') {
        activeFilters.color = val;
      } else if(key === 'search') {
        activeFilters.search = val;
      }
    }

    // Get the icons
    var icons = this.getFilteredIcons(activeFilters);

    // Return the initial state
    return {
      activeFilters: activeFilters,
      iconCount: icons.length,
      visibleIcons: icons.slice(0, this.props.threshold),
      allIcons: icons,
    };
  },

  componentDidMount: function(){
    // Handle scroll event for infinite scroll at bottom of page
    var throttle = function(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last,
          deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date,
            args = arguments;
        if (last && now < last + threshhold) {
          // hold on to it
          clearTimeout(deferTimer);
          deferTimer = setTimeout(function () {
            last = now;
            fn.apply(context, args);
          }, threshhold);
        } else {
          last = now;
          fn.apply(context, args);
        }
      };
    }
    var footerHeight = document.getElementById('footer').offsetHeight;
    window.onscroll = throttle(function(){
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - footerHeight) {
        this.handleShowMore();
      }
    }, 150, this);
  },

  // Scroll to top button
  // http://stackoverflow.com/questions/4034659/is-it-possible-to-animate-scrolltop-with-jquery
  handleScrollTop: function(e) {
    e.preventDefault();
    scrollTo(document.body, 0, 500);
  },

  // User input filters
  handleUserInput: function(activeFilters) {
    var icons = this.getFilteredIcons(activeFilters);
    this.setState({
      activeFilters: activeFilters,
      iconCount: icons.length,
      visibleIcons: icons.slice(0, this.props.threshold),
      allIcons: icons
    });
  },

  // Return an array of icon objects (filtered if relevant)
  getFilteredIcons: function(activeFilters) {
    return this.props.icons.filter(function(icon) {

      if(activeFilters.category !== '') {
        if(activeFilters.category !== icon.category){
          return false;
        }
      }

      if(activeFilters.color !== '') {
        if(icon.tags.indexOf(activeFilters.color) === -1) {
          return false;
        }
      }

      if(activeFilters.search !== ''){
        if(icon.title.score(activeFilters.search) < .3) {
          return false;
        }
      }

      return true;
    });
  },

  handleShowMore: function(e) {
    //e.preventDefault();
    var sliceBegin = this.state.visibleIcons.length;
    var sliceEnd = sliceBegin + this.props.threshold;
    var newIcons = this.state.allIcons.slice(sliceBegin, sliceEnd);
    this.setState({
      visibleIcons: this.state.visibleIcons.concat( newIcons )
    });
  },

  render: function() {
    return (
      <div>
        <IconFilters
          site={this.props.site}
          iconCount={this.state.iconCount}
          activeFilters={this.state.activeFilters}
          onUserInput={this.handleUserInput}
        />

        <IconList
          icons={this.state.visibleIcons}
          showMore={(this.state.allIcons.length > this.state.visibleIcons.length) ? true : false}
        />

        <a href="#" className="scroll-top" onClick={this.handleScrollTop}>Top</a>
      </div>
    );
  }
});

module.exports = SearchIcons;
