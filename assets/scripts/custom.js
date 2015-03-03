var Filter = {
    key: null,
    val: null,

    init: function() {
        // If there's a query parameter in the URL, load that
        // otherwise load search as the default
        var query = location.search.substring(1);
        if(query != '') {
            query = query.split('=');
            this.key = query[0];
            this.val = query[1];
        } else {
            this.key = 'search',
            this.val = '';
        }
        // load the relevant key/vals on page load
        $('.filter-key option[value=' + this.key + ']').prop('selected', true);
        this.changeKey(this.key);
        this.changeVal(this.val);

        // If there's a parameter passed in, load that
        if(query != ''){
            $('#' + this.key + ' option[value=' + this.val + ']').prop('selected', true);        
            Icons.findMatches();
            Icons.render();
        }
    },

    changeKey: function(newKey){

        // Delete list
        $('.list-icons').html('');

        // Hide old
        $('#' + this.key).hide();

        // Set and show new
        this.key = newKey.trim();
        $('#' + this.key).css('display', 'inline-block');

        // Log it
        console.log('Changed type to: ' + this.key);
    },

    changeVal: function(newVal){
        this.val = newVal.trim();
        console.log('Changed type value to: ' + this.val);

        //location.search = this.key + '=' + this.val;
    }
}

var Icons = {
    data: [],
    results: [],
    renderLength: 20,
    $elList: $('.list-icons'),
    $elShowMore: $('.show-more'),
    $template: $('#list-icons-template').html(),
    $templateZero: $('#list-icons-zero-template').html(),

    intialize: function(jsonResponse) {
        this.data = jsonResponse;
    },

    // Create data for rendering the results
    // Should return `this.results` with massaged data for rendering
    findMatches: function() {

        // Reset current results
        this.$elList.html('');
        this.$elShowMore.hide();
        this.results = [];

        // Use Fuse to search the data object for the specified key
        // search looks in the title key
        // otherwise it matches what the user has chosed (i.e. 'category', 'designer', etc)
        // If it's not search, it must be an exact match (threshold = 0)
        // Otherwise if it's search, give it some leeway.
        // Also, don't sort non-search as Fuse sometimes returns things weird
        // And besides, the data is already sorted chronologically which we want
        if(Filter.key == 'search') {
            var f = new Fuse(this.data, {keys: ['title'], threshold: .333});
        } else {
            var f = new Fuse(this.data, {keys: [Filter.key], threshold: 0, shouldSort: false});
        }
        var matches = f.search(Filter.val);

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

        // Search is sorted by match relevance
        // If it's not search, sort it by year using the 'link' key
        // (Fuse sometimes returns matches sorted weird ...)
        // if(Filter.key != 'search') {
        //     this.results.sort(function(a,b){
        //         if (a.link < b.link) {
        //             return 1;
        //         }
        //         if (a.link > b.link) {
        //             return -1;
        //         }
        //         // a must be equal to b
        //         return 0;
        //     });
        // }
        
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
            this.$elShowMore.show();
        } else if (this.results.length == 0) {
            this.$elList.append( Mustache.render(this.$templateZero, {}) );
            console.log(Mustache.render(this.$templateZero, {}));
        }
        else {
            // Render what's left
            this.$elList.append( Mustache.render(this.$template, {icons: this.results}) );

            // Hide the show more
            this.$elShowMore.hide();
        }
    }
};

$(document).ready(function(){

    //$.getJSON("/data.json", Icons.intialize);
    $.ajax({
        url: '/data.json',
        dataType: 'json',
        async: false,
        success: function(data) {
            Icons.intialize(data);
        }
    });

    // Initialize
    Filter.init();

    $('select.filter-key').on('change', function(){
        Filter.changeKey( $(this).val() );
        Icons.$elShowMore.hide();

        // Reset the <select> for the value
        $('.filter-val option:selected').each(function(){
            $(this).prop('selected', false);
        });
    });

    $('select.filter-val').on('change', function(){
        Filter.changeVal( $(this).val() );
        Icons.findMatches();
        Icons.render();
    });

    $('#search').on('submit', function(e){
        e.preventDefault();
        Filter.changeVal( $(this).find('input').val() );
        Icons.findMatches();
        Icons.render();
    });

    $('.show-more').on('click', function(e){
        e.preventDefault();
        Icons.render();
    });

});
