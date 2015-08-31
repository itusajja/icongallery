'use strict';

var IconApp = React.createClass({
  displayName: 'IconApp',

  propTypes: {
    icons: React.PropTypes.array.isRequired,
    site: React.PropTypes.object.isRequired,
    threshold: React.PropTypes.number.isRequired
  },

  getInitialState: function getInitialState() {
    // Setup intial filters
    var activeFilters = {
      'category': '',
      'color': '',
      'search': ''
    };

    // Check to see if params were passed via URL
    // If they were, set the appropriate filter val
    var query = location.search.substring(1);
    if (query !== '') {
      query = query.split('=');
      var key = query[0];
      var val = query[1];
      if (key === 'category') {
        activeFilters.category = val;
      } else if (key === 'color') {
        activeFilters.color = val;
      } else if (key === 'search') {
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
      hiddenIcons: icons
    };
  },

  componentDidMount: function componentDidMount() {
    var throttle = function throttle(fn, threshhold, scope) {
      threshhold || (threshhold = 250);
      var last, deferTimer;
      return function () {
        var context = scope || this;

        var now = +new Date(),
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
    };

    window.onscroll = throttle(function () {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        this.handleShowMore();
      }
    }, 250, this);
  },

  // Scroll to top button
  // http://stackoverflow.com/questions/4034659/is-it-possible-to-animate-scrolltop-with-jquery
  handleScrollTop: function handleScrollTop(e) {
    e.preventDefault();
    $("html, body").animate({ scrollTop: "0px" });
  },

  // User input filters
  handleUserInput: function handleUserInput(activeFilters) {
    var icons = this.getFilteredIcons(activeFilters);
    this.setState({
      activeFilters: activeFilters,
      iconCount: icons.length,
      visibleIcons: icons.slice(0, this.props.threshold),
      hiddenIcons: icons
    });
  },

  // Return an array of icon objects (filtered if relevant)
  getFilteredIcons: function getFilteredIcons(activeFilters) {
    return this.props.icons.filter(function (icon) {

      if (activeFilters.category !== '') {
        if (activeFilters.category !== icon.category) {
          return false;
        }
      }

      if (activeFilters.color !== '') {
        if (icon.tags.indexOf(activeFilters.color) === -1) {
          return false;
        }
      }

      if (activeFilters.search !== '') {
        if (icon.title.score(activeFilters.search) < .3) {
          return false;
        }
      }

      return true;
    });
  },

  handleShowMore: function handleShowMore(e) {
    //e.preventDefault();
    var sliceBegin = this.state.visibleIcons.length;
    var sliceEnd = sliceBegin + this.props.threshold;
    var newIcons = this.state.hiddenIcons.slice(sliceBegin, sliceEnd);
    this.setState({
      visibleIcons: this.state.visibleIcons.concat(newIcons)
    });
  },

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(IconFilters, {
        site: this.props.site,
        iconCount: this.state.iconCount,
        activeFilters: this.state.activeFilters,
        onUserInput: this.handleUserInput
      }),
      React.createElement(IconList, {
        icons: this.state.visibleIcons
      }),
      this.state.hiddenIcons.length > this.state.visibleIcons.length ? React.createElement(IconShowMore, null) : null,
      React.createElement(
        'a',
        { href: '#', className: 'scroll-top', onClick: this.handleScrollTop },
        'Top'
      )
    );
  }
});

var IconList = React.createClass({
  displayName: 'IconList',

  propTypes: {
    icons: React.PropTypes.array.isRequired
  },

  render: function render() {
    return React.createElement(
      'ul',
      { className: 'list-icons' },
      this.props.icons.length > 0 ? this.props.icons.map(function (icon, i) {
        return React.createElement(IconItem, { key: i, icon: icon });
      }) : React.createElement(IconItemZeroState, null)
    );
  }
});

var IconItem = React.createClass({
  displayName: 'IconItem',

  propTypes: {
    icon: React.PropTypes.object.isRequired
  },

  render: function render() {
    var url = this.props.icon.url,
        title = this.props.icon.title,
        src = this.props.icon.src,
        src2x = this.props.icon.src2x;
    return React.createElement(
      'li',
      null,
      React.createElement(
        'a',
        { href: url, className: 'icon-container', title: title },
        React.createElement('img', {
          alt: title + ' app icon',
          className: 'icon icon-128',
          src: src,
          'data-at2x': src2x
        })
      )
    );
  }
});

var IconItemZeroState = React.createClass({
  displayName: 'IconItemZeroState',

  render: function render() {
    return React.createElement(
      'li',
      { className: 'list-icons__zero-state' },
      'No icons. Try changing your filters.'
    );
  }
});

var IconShowMore = React.createClass({
  displayName: 'IconShowMore',

  render: function render() {
    return React.createElement(
      'div',
      { className: 'show-more' },
      React.createElement('img', { src: '/assets/img/loading.gif', width: '32', height: '32', alt: 'loading gif' })
    );
  }
});

var IconFilters = React.createClass({
  displayName: 'IconFilters',

  propTypes: {
    iconCount: React.PropTypes.number.isRequired,
    activeFilters: React.PropTypes.object.isRequired,
    onUserInput: React.PropTypes.func.isRequired,
    site: React.PropTypes.object.isRequired
  },

  handleChange: function handleChange() {
    this.props.onUserInput({
      'category': this.refs.categoryInput.getDOMNode().value,
      'color': this.refs.colorInput.getDOMNode().value,
      'search': this.refs.searchInput.getDOMNode().value
    });
  },

  render: function render() {
    return React.createElement(
      'div',
      { className: 'filters' },
      React.createElement(
        'span',
        { className: 'filters__count' },
        this.props.iconCount,
        this.props.iconCount > 1 ? ' icons' : ' icon'
      ),
      React.createElement('input', {
        ref: 'searchInput',
        onKeyUp: this.handleChange,
        defaultValue: this.props.activeFilters.search,
        type: 'search',
        placeholder: 'Search...',
        autoComplete: 'off',
        autoCorrect: 'off',
        spellCheck: 'false'
      }),
      React.createElement(
        'select',
        {
          ref: 'categoryInput',
          onChange: this.handleChange,
          value: this.props.activeFilters.category },
        React.createElement(
          'option',
          { value: '' },
          'All categories...'
        ),
        this.props.site.categories.map(function (category, i) {
          return React.createElement(
            'option',
            { key: i, value: category.id },
            category.name
          );
        })
      ),
      React.createElement(
        'select',
        {
          ref: 'colorInput',
          onChange: this.handleChange,
          value: this.props.activeFilters.color },
        React.createElement(
          'option',
          { value: '' },
          'All colors...'
        ),
        this.props.site.colors.map(function (color, i) {
          return React.createElement(
            'option',
            { key: i, value: color.id },
            color.name
          );
        })
      )
    );
  }
});

// Kick it off by getting the initial data
$(document).ready(function () {
  $.ajax({
    url: '/data.json',
    dataType: 'json',
    async: false
  }).then(function (response) {
    React.render(React.createElement(IconApp, {
      icons: response.icons,
      site: response.site,
      threshold: 20
    }), document.getElementById('main'));
  }).fail(function (error) {
    console.log(error);
  });
});

/*
var Icons = {
    data: [],
    results: [],
    renderLength: 20,
    $elList: $('.list-icons'),
    $elShowMore: $('.show-more'),
    $template: $('#list-icons-template').html(),
    $templateZero: $('#list-icons-zero-template').html(),

    init: function(jsonResponse) {
        this.data = jsonResponse;

        // If there's a query parameter in the URL, load that
        var query = location.search.substring(1);
        if(query != '') {
            query = query.split('=');
            this.key = query[0];
            this.val = query[1];

            if(this.key == 'search') {
                $('#search').val(this.val);
            } else {
                $('#' + this.key + ' option[value=' + this.val + ']').prop('selected', true);
            }
            Icons.findMatches([{
                type: this.key,
                val: this.val
            }]);
            Icons.render();
        } 
    },
    */
