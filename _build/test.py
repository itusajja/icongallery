import json
import time
import urllib
import urllib2
from pprint import pprint
import re

def printData(data):
    print '\033[92m'
    pprint(data)
    print '\033[0m'

def printError(text):
    print '\033[91m' + text + '\033[0m'


def createPost(app):
    global post

    # Required
    # All of these should be returned by the iTunes API on a proper request
    # -----
    # title
    # slug
    # date
    # category
    # itunes-url
    # app-developer
    post = {
        'title' : app['trackName'],
        'date' : time.strftime("%Y-%m-%d"),
        'category' : app['primaryGenreName'],
        'itunes-url' : app['trackViewUrl'],
        'app-developer' : app['artistName']
    }
    # slug
    slug = re.search('/app/(.*)/', app['trackViewUrl']);
    slug = slug.group(1)
    post['slug'] = slug
    
    # Optionals
    # ------
    # app-developer-url
    # designer
    # designer-url
    # tags
    if hasattr(app, 'sellerUrl'):
        post['app-developer-url'] = app['sellerUrl']
    
    designer = raw_input('designer: ')
    if(designer != ''):
        designerUrl = raw_input('designer-url: ')
        post['designer'] = designer
        post['designer-url'] = designerUrl

    tags = raw_input('tags: (space separated) ')
    if(tags != ''):
        post['tags'] = tags

def modifyPost():
    global post
    printData(post)
    key = raw_input('Changes/additions? Enter the key: (otherwise write files) ')
    if(key != ''):
        post[key] = raw_input('New value: ')
        modifyPost()

def getItunesId():
    url = raw_input('iTunes URL: ')
    url = url.strip()
    urlBeginsCorrectly = re.match('^(http|https):\/\/itunes.apple.com', url)
    urlHasId = re.search('\/id([\d]+)', url)
    if(urlBeginsCorrectly != None and urlHasId != None):
        return urlHasId.group(1)
    else:
        printError('Invalid URL. Follow this pattern: https://itunes.apple.com/us/app/angry-birds/id343200656?mt=8')
        getItunesId()
    
def makeItunesRequest(appId):
    response = urllib2.urlopen('https://itunes.apple.com/lookup?id=' + appId)
    data = json.load(response)
    #validate response data  
    if(data['results'][0]['artworkUrl512']):
        return data['results'][0]
    else:
        printError('The iTunes API response appears to be incorrect')
    
def writeImage(imageUrl):
    urllib.urlretrieve(imageUrl, "test.png")

post = {}
itunesId = getItunesId()
itunesResponse = makeItunesRequest(itunesId)
createPost(itunesResponse)
modifyPost()
#writeImage(itunesResponse['artworkUrl512'])

#printData(post)


