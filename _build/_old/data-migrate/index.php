<?php

// Set date
date_default_timezone_set('UTC');

// Get Data
$data = simplexml_load_file("ios.xml");
$namespaces = $data->getNamespaces(true);


function li($key, $val, $highlight=false) {
    if($val != '' || $val != null) {
        if($highlight) {
            $li = '<li style="color:red">';
        } else {
            $li = '<li>';
        }
        return $li . '<b>' . $key . '</b>: ' . $val . '</li>';
    }
}
// write a new line to a file
function line($key, $val) {
    if($val != '' || $val != null) {
        return $key . ': ' . $val . "\n";
    }
}

function makeDate($str) {
    return date('Y-m-d', strtotime($str) );
}

function makeImageName($date, $slug) {
    return $slug . '-' . date('Y', strtotime($date)) . '.png';
}

function getCategoryAttrs($cats, $attr) {
    $vals = '';

    $i = 0;

    foreach ($cats as $cat) {
        $attrs = $cat->attributes();
        if( $attrs['domain'] == $attr ) {
            $vals .= $attrs['nicename'] . ', ';
        } 
    }

    // Return everything but last two characters, which is the last comma separator ', '
    return substr($vals, 0, -2);
}

function makeMeta($postmeta, $key) {

    foreach ($postmeta as $meta) {
        if($meta->meta_key == $key) {
            return $meta->meta_value;
        }
    }
}

function makeAlias($url) {
    $url = explode("gallery.com", $url);
    return $url[1];
}

function writeFile($filename, $data) {
    $handle = fopen($filename, 'a') or die('Cannot open file:  '.$filename);
    fwrite($handle, $data);
}

function appendToFile($data, $file) {
    $handle = fopen($file, 'a') or die('Cannot open file:  '.$file);
    fwrite($handle, $data);
}

function seoString($string) {
    //Lower case everything
    $string = strtolower($string);
    //Make alphanumeric (removes all other characters)
    $string = preg_replace("/[^a-z0-9_\s-]/", "", $string);
    //Clean up multiple dashes or whitespaces
    $string = preg_replace("/[\s-]+/", " ", $string);
    //Convert whitespaces and underscore to dash
    $string = preg_replace("/[\s_]/", "-", $string);
    return $string;
}

// loop over all the data, trying to find a post with a specific ID
function getAttachmentURL($id) {
    global $data;
    global $namespaces;

    //$id = intval($id); // doesn't work otherwise

    foreach($data->channel->item as $post) {
        $wp = $post->children($namespaces['wp']);
        
        if( $wp->post_id == (string) $id) {
            //echo $id;
            return $wp->attachment_url;
            break;
        }
    }
}

// gets the ID in the itunes url, i.e. http://itunes.apple.com/app/APP-NAME/id9381938
function getID($url) {
    $id = explode('app/', $url);
    $id = explode('/id', $id[1]);
    return $id[0];
}

// Write categories to file
// foreach($data->channel as $channel) {
//     $wp = $channel->children($namespaces['wp']);

//     echo '---' . "\n";
//     foreach($wp->category as $cat) {
//         echo $cat->cat_name;
//         appendToFile( '-' . "\n" , 'categories.yml');
//         appendToFile( 'nicename: "' . $cat->cat_name . '"' . "\n", 'categories.yml');
//         appendToFile( 'slug: "' . $cat->category_nicename . '"' . "\n", 'categories.yml');
//     }
// }




$designers = [];
echo '<ol>';
foreach($data->channel->item as $post) {

    $wp = $post->children($namespaces['wp']);

    if($post->title != 'Auto Draft' && $wp->post_type == 'post') {
        

        $title = $post->title;
        $id = $wp->post_name;
        $date = makeDate($post->pubDate);
        $category = getCategoryAttrs($post->category, 'category');
        $tags = getCategoryAttrs($post->category, 'post_tag');
        $itunesURL = makeMeta($wp->postmeta, 'itunes-url');
        $developer = makeMeta($wp->postmeta, 'developed-by');
        $developerURL = makeMeta($wp->postmeta, 'developer-site');
        $designer = makeMeta($wp->postmeta, 'icon-design-by');
        $designerURL = makeMeta($wp->postmeta, 'designer-site');
        $alias = makeAlias($post->link);
        $imageName = makeImageName($post->pubDate, $wp->post_name);
        $imageURL = getAttachmentURL( makeMeta($wp->postmeta, '_thumbnail_id') );
        $filename = makeDate($post->pubDate) . '-' . $wp->post_name . '.md';

        echo '<li>' . $title . '</li>';

        echo '<ul>';
        
        
        echo li('title', $title) . 
             li('id', $id ) . 
             li('date', $date) . 
             li('category', $category ) .
             li('tags', $tags ) . 
             li('itunes-url', $itunesURL ) .
             li('app-developer', $developer ) .
             li('app-developer-url', $developerURL ) . 
             li('icon-designer', $designer, true ) .
             li('icon-designer-url', $designerURL, true ) .
             li('alias', $alias ) .
             li('_image-name', $imageName) . 
             li('_image-url', $imageURL ) .
             li('_filename', $filename )
             ;

        // echo '</ul>';

        // write image file
        //copy($imageURL, 'ios/' . $imageName);

        //
        //  output posts files
        // writeFile('posts/'.$filename,
        //      "---\n". 
        //      line('title', $title) . 
        //      line('id', $id ) . 
        //      line('date', $date) . 
        //      line('category', $category ) .
        //      line('tags', $tags ) . 
        //      line('itunes-url', $itunesURL ) .
        //      line('app-developer', $developer ) .
        //      line('app-developer-url', $developerURL ) . 
        //      line('icon-designer', $designer, true ) .
        //      line('icon-designer-url', $designerURL, true ) .
        //      line('alias', $alias ) .
        //      "---\n" 
        //      );

        //
        // Output designer file
        //
        // $designer = null;
        // $designer = (string) makeMeta($wp->postmeta, 'icon-design-by');
        // $designerurl = (string) makeMeta($wp->postmeta, 'designer-site');

        // if ( !in_array($designer, $designers) ) {  
            
        //     // write designer info to file
        //     appendToFile( '-' . "\n", 'designers.yml');
        //     appendToFile( "\tnicename: " . $designer . ", \n", 'designers.yml');
        //     appendToFile( "\tslug: " . seoString($designer) . ", \n", 'designers.yml');
        //     appendToFile( "\turl: " . $designerurl . "\n", 'designers.yml');

        //     // append to array
        //     $designers[] = $designer;
        // }

        

        
        

    } 
    
}
echo '</ol>';


// for future single get
function getItunesArtwork($url, $id) {
    // Get itunes url: 
    // http://stackoverflow.com/questions/8351655/get-itunes-id-from-url
    $itunesID = explode('/id', parse_url($url, PHP_URL_PATH));
    $data = json_decode( file_get_contents('https://itunes.apple.com/lookup?id=' . $itunesID[1]) );

    if( $data->results[0]->artworkUrl512 ) {

        // Get image dimensions
        $imageSize = getimagesize($data->results[0]->artworkUrl512);

        // Save the image format: angry-birds-2014-512.png
        if(!$id) { // if there's no filename id, give it the one from the api response
            $id = seoString($data->results[0]->trackName);
        } 
        $file =  'images/src/' . $id . '-2014.png';
        copy($data->results[0]->artworkUrl512, $file);

    } else {
        echo "Invalide response. Cannot find artwork.";
    }
    
    /*
        $data->results[0]->artworkUrl512; // image
        $data->results[0]->trackName; // title
        $data->results[0]->artistName; // developer
        $data->results[0]->sellerUrl; // developerurl
        $data->results[0]->primaryGenreName; // category
    */
}