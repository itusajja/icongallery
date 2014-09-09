<?php 
date_default_timezone_set('UTC');

function queryItunes($id) {
    $response = json_decode( file_get_contents('https://itunes.apple.com/lookup?id=' . $id) );
    // There should only be one response. If there is, return it. Otherwise throw error and stop.
    if( $response->resultCount == 1) {
        return $response->results[0];
    } else {
        echo "INVALID. Request returned ".$response->resultCount." results (must be 1, no more).\n";
        exit;
    }
}

function askQuestion($q) {
    echo $q." ";
    $handle = fopen ("php://stdin","r");
    $line = fgets($handle);
    return trim($line);
}

function startsWith($haystack, $needle) {
    return $needle === "" || strpos($haystack, $needle) === 0;
}
function startsWithNumber($str) {
    return preg_match('/^\d/', $str) === 1;
}

function populatePostVar($d) {

    global $post;

    // date
    $date = date('Y-m-d');

    // slug - http://itunes.apple.com/us/app/angry-birds/id9348818
    $slug = explode('app/', $d->trackViewUrl);
    $slug = explode('/id', $slug[1]);
    $slug = $slug[0];

    // Designer
    $designer = askQuestion('Do you want to add a designer? [y/n]');
    if($designer != 'y') {
        $designer = null;
    } else {
        echo "\n";
        $designer = askQuestion('Designer name: ');
        $designerUrl = askQuestion('Designer URL: ');
    }

    // Tags
    $tags = askQuestion('Do you want to add tags? [y/n]');
    if($tags != 'y') {
        $tags = null;
    } else {
        $tags = askQuestion('List of tags (space separated): ');
        echo "\n";
    }

    if($d->trackName)
        $post['title'] = $d->trackName;
    if($slug)
        $post["slug"] = $slug;
    if($date)
        $post["date"] = $date;
    if($d->primaryGenreName)
        $post["category"] = $d->primaryGenreName;
    if($d->trackViewUrl)
        $post["itunes-url"] = $d->trackViewUrl;
    if($d->artistName)
        $post["app-developer"] = $d->artistName;
    if($d->sellerUrl)
        $post["app-developer-url"] = $d->sellerUrl;
    if($designer)
        $post["icon-designer"] = $designer;
    if($designerUrl)
        $post["icon-designer-url"] = $designerUrl;
    if($tags)
        $post["tags"] = $tags;
}

function outputPostVar() {
    global $post;

    $str = "---\n";
    foreach ($post as $key => $value) { 
        if($value)   
            $str .= $key . ": " . $value . "\n";
    }
    $str .= "---\n"; 
    return $str;
}


/* ============================ START ===================== */

$post = array(
    "title" => "",
    "slug" => "",
    "date" => "",
    "category" => "",
    "itunes-url" => "",
    "app-developer" => "",
    "app-developer-url" => "",
    "icon-designer" => "",
    "icon-designer-url" => "",
    "tags" => ""
);

/*
    Get the iTunes URL
    Make it an ID, if necessary
*/
$input = askQuestion("What's the iTunes ID or URL:");
if( startsWith($input, 'https://itunes.apple') ) {
    echo "App Store URL entered - ";
    // Get all numbers after '/id'
    // http://stackoverflow.com/questions/15581734/get-number-after-string-php-regex
    preg_match_all('/\/id([\d]+)/',$input,$matches);
    $id = $matches[1][0];
} else if( startsWithNumber($input) ) {
    echo "App Store ID entered - ";
    $id = $input;
} else {
    echo "You have to enter a valid iTunes ID or URL. Try again. \n";
    exit;
}

echo "iTunes ID: ".$id."\n";

/*
    Query iTunes, output info
*/
$data = queryItunes($id);
populatePostVar($data);
echo outputPostVar();




/*
    Ask if the data is ok
    write it
*/
$input = askQuestion('Look good? Write the files? [y/n]');
if($input != 'y') {
    exit;
}

copy($data->artworkUrl512, $post['slug'].'-'.date('Y').'.png' );

$filename = $post['date'] . "-" . $post['slug'] . ".md";
$handle = fopen($filename, 'a') or die('Cannot open file:  '.$filename);
fwrite($handle, outputPostVar());