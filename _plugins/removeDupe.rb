# Get an array of unique numbers
# length of array and random number ceiling = input
# http://stackoverflow.com/a/20272144/1339693
module Jekyll
  module RemoveDuplicates
    def remove_duplicates(input)
      arr = input.uniq
      arr
    end
  end
end

Liquid::Template.register_filter(Jekyll::RemoveDuplicates)


