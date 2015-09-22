<?php
// if image exists
function exists($url)
{
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL,$url);
    // don't download content
    curl_setopt($ch, CURLOPT_NOBODY, 1);
    curl_setopt($ch, CURLOPT_FAILONERROR, 1);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    if(curl_exec($ch)!==FALSE)
    {
        return true;
    }
    else
    {
        return false;
    }
}

echo '<h1>See if icon file exists</h1>';

echo '<ul>';
for ($i=300; $i < 600; $i++) {
  if(exists('http://a3.mzstatic.com/us/r30/Purple3/v4/f4/d9/91/f4d991dc-8466-6bbd-15fe-cb56d8e78f87/icon'.$i.'x'.$i.'.jpeg')) {
      echo '<li>' . $i . '</li>';
  }
}
echo '</ul>';
