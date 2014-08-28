# Get an array of unique numbers
# length of array and random number ceiling = input
# http://stackoverflow.com/a/20272144/1339693
module Jekyll
  module RandomArray
    def rand_array(input)
      size = input.to_i
      i = size
      array = []
      while i > 0 do
        r = (rand(size)+1)
        (array << r; i -= 1) unless array.include?(r)
      end
      array
    end
  end
end

Liquid::Template.register_filter(Jekyll::RandomArray)


