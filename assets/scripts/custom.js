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
