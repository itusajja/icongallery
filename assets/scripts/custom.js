var IconBox = React.createClass({

  propTypes: {
    icons: React.PropTypes.array.isRequired,
    threshold: React.PropTypes.number.isRequired
  },

  getInitialState: function(){
    return {
      activeCategory: '',
      iconCount: this.props.icons.length,
      //currentIcons: this.props.icons.slice(0, this.props.threshold),
      visibleIcons: this.props.icons.slice(0, this.props.threshold),
      hiddenIcons: this.props.icons,
    };
  },

  handleUserInput: function(activeCategory) {
    var icons = [];
    this.props.icons.forEach(function(icon) {
        // if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        //     return;
        // }
        if (activeCategory !== '') {
          if(activeCategory == icon.category){
            icons.push(icon);
          }
        } else {
            icons.push(icon);
        }        
    }.bind(this));

    this.setState({
      activeCategory: activeCategory,
      iconCount: icons.length,
      visibleIcons: icons.slice(0, this.props.threshold),
      hiddenIcons: icons
    });
  },

  filterIcons: function(activeCategory) {
    var icons = [];
    this.props.icons.forEach(function(icon) {
        // if (product.name.indexOf(this.props.filterText) === -1 || (!product.stocked && this.props.inStockOnly)) {
        //     return;
        // }
        if (activeCategory !== '') {
          if(activeCategory == icon.category){
            icons.push(icon);
          }
        } else {
            icons.push(icon);
        }        
    }.bind(this)); 
    return icons;
  },

  // getIcons: function(){
  //   const newIcons = this.props.icons.slice(this.state.currentIcons.length, this.state.currentIcons.length + showMoreThreshold);
  //   return this.state.currentIcons.concat( newIcons );
  // },

  handleShowMore: function(e) {
    e.preventDefault();
    var newIcons = this.state.hiddenIcons.slice(this.state.visibleIcons.length, this.state.visibleIcons.length + this.props.threshold);
    this.setState({
      visibleIcons: this.state.visibleIcons.concat( newIcons )
    });
  },

  render: function() {
    return (
      <div>
        <IconFilters 
          iconCount={this.state.iconCount}
          activeCategory={this.state.activeCategory}
          onUserInput={this.handleUserInput}
        />
        <IconList icons={this.state.visibleIcons} /> 
        {(this.state.hiddenIcons.length > this.state.visibleIcons.length) ? 
          <ShowMoreButton onShowMore={this.handleShowMore}/>
          : null
        }       
      </div>
    );
  }
});




var IconList = React.createClass({
  propTypes: {
    icons: React.PropTypes.array.isRequired,
  },

  render: function() {
    return (
        <ul className="list-icons" >
          {
            (this.props.icons.length > 1) ? this.props.icons.map(function(icon) {
              return <IconItem key={icon.id} icon={icon}/>;
            }) : <IconItemZeroState />
          } 
        </ul>
    );
  }
});

var IconItem = React.createClass({
  
  render: function() {
    // Make link
    var year = new Date(this.props.icon.date).getFullYear();
    var link = '/' + year + '/' + this.props.icon.slug + '/';
    var iconFile = this.props.icon.slug + '-' + year;

    return (
      <li>
        <a href={link} className="icon-container" title={this.props.icon.title}>
          <img
            alt={this.props.icon.title + 'app icon'}
            className="icon icon-128"
            src={'/applewatchicongallery/img/128/' + iconFile + '.png'}
            data-at2x={'/applewatchicongallery/img/256/' + iconFile + '.png'}
          />
          {/* mask here */}
        </a>    
      </li>
    );
  }
});



var IconItemZeroState = React.createClass({
  render: function() {
    return (
      <li className="list-icons__zero-state">No icons. Try changing your filters.</li>
    );
  }
});




var ShowMoreButton = React.createClass({
  propTypes: {
    onShowMore: React.PropTypes.func.isRequired
  },

  render: function(){
    return (
      <a href="#" className="show-more" onClick={this.props.onShowMore}>
        Show more&hellip;
      </a>
    )
  },
});




var IconFilters = React.createClass({
  propTypes: {
    iconCount: React.PropTypes.number,
    activeCategory: React.PropTypes.string,
    onUserInput: React.PropTypes.func
  },

  handleChange: function() {
    this.props.onUserInput(
        this.refs.categoryInput.getDOMNode().value
    );
  },

  render: function() {
    return (
      <div className="search-header">
        <span className="search-header__count">{this.props.iconCount} icons</span>
        <select id="category" className="filter-val" onChange={this.handleChange} ref="categoryInput"> <option value="">All categories...</option> <option value="6018">Books</option> <option value="6000">Business</option> <option value="6022">Catalogs</option> <option value="6017">Education</option> <option value="6016">Entertainment</option> <option value="6015">Finance</option> <option value="6023">Food &amp; Drink</option> <option value="6014">Games</option> <option value="6013">Health &amp; Fitness</option> <option value="6012">Lifestyle</option> <option value="6020">Medical</option> <option value="6011">Music</option> <option value="6010">Navigation</option> <option value="6009">News</option> <option value="6021">Newsstand</option> <option value="6008">Photo &amp; Video</option> <option value="6007">Productivity</option> <option value="6006">Reference</option> <option value="6005">Social Networking</option> <option value="6004">Sports</option> <option value="6003">Travel</option> <option value="6002">Utilities</option> <option value="6001">Weather</option> </select>
      </div>
    );
  }
});




// Kick it off by getting the initial data
var iconData = []
$(document).ready(function(){
    $.ajax({
        url: '/data.json',
        dataType: 'json',
        async: false,
        success: function(data) {
            iconData = data;
            React.render(
              <IconBox icons={iconData} threshold={12} />,
              document.getElementById('main')
            );
        }
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

    // Create data for rendering the results
    // Should return `this.results` with massaged data for rendering
    // @filters: array of objects representing each type of filter
    // @filters.type corresponds to the filter type, i.e. search, category, tag
    // @filters.val corresponds to the value selected
    findMatches: function(filters) {

        // Reset current results
        this.$elList.html('');
        this.$elShowMore.hide();
        this.results = [];

        if(filters.length > 0){
            // Use Fuse to search the data object for the specified key
            // search looks in the title key
            // otherwise it matches what the user has chosed (i.e. 'category', 'designer', etc)
            // If it's not search, it must be an exact match (threshold = 0)
            // Otherwise if it's search, give it some leeway.
            // Also, don't sort non-search as Fuse sometimes returns things weird
            // And besides, the data is already sorted chronologically which we want
            var f = new Fuse(this.data);
            for (var i = 0; i < filters.length; i++) {
                if(filters[i].type == 'search') {
                    f.options.keys = ['title'];
                    f.options.threshold = .333;
                    f.list = f.search(filters[i].val);
                } else {
                    f.options.keys = [filters[i].type];
                    f.options.threshold = 0;
                    f.options.shouldSort = false;
                    f.list = f.search(filters[i].val);
                }
            };
            var matches = f.list;

            // Massage the matched objects data 
            // and stick what we need in this.results for rendering
            for (var i = 0; i < matches.length; i++) {
                var year = new Date(matches[i].date).getFullYear();
                this.results.push(
                    {
                        title: matches[i].title,
                        link: year + '/' + matches[i].slug + '/',
                        icon: matches[i].slug + '-' + year
                    }
                );
            };
        }
        $('.search-header__count').html( this.results.length + (this.results.length == 1 ? ' icon' : ' icons') );
        console.log('Found ' + this.results.length + ' matches')
    },

    // Render more, or render new
    render: function(){
        if(this.results.length > this.renderLength) {
            // pop off the data we need
            var renderData = this.results.splice(0, this.renderLength);

            // render it
            this.$elList.append( Mustache.render(this.$template, {icons: renderData}) );

            // reveal show more button
            var remaining = (this.results.length > this.renderLength) ? 20 : this.results.length;
            this.$elShowMore.show().html('Show ' + remaining + ' more...');
        } else if (this.results.length == 0) {
            this.$elList.append( Mustache.render(this.$templateZero, {}) );
        } else {
            // Render what's left
            this.$elList.append( Mustache.render(this.$template, {icons: this.results}) );

            // Hide the show more
            this.$elShowMore.hide();
        }
    }
};

$(document).ready(function(){

    $.ajax({
        url: '/data.json',
        dataType: 'json',
        async: false,
        success: function(data) {
            Icons.init(data);
        }
    });

    // Form submit
    // Submits filter data formatted according to what Icons.findMatches() needs
    $('#form').on('change', function(e){
        var $inputs = $(':input', this),
            filters = [];
        
        $inputs.each(function(){
            if($(this).val() != '') {
                filters.push({
                    type: $(this).attr('id'),
                    val: $(this).val()
                });
            }
        });
        Icons.findMatches(filters);
        Icons.render();
    }).on('submit', function(e){
        e.preventDefault();
    });

    // Show more link
    $('.show-more').on('click', function(e){
        e.preventDefault();
        Icons.render();
    });

});
*/