# hippo

> Hippo, a simple solution for web analytics.

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

#### Install Node

Visit [http://nodejs.org](http://nodejs.org), download and install the proper version of nodejs.

#### Install Cortex

    # maybe you should use `sudo`
    npm install -g cortex

## Using hippo In Your Project

First, install 'hippo' directly with `ctx install` (recommended)
	
	ctx install hippo --save
	
or, you could update your package.json manually
    
    dependencies: {
        'hippo': '<version-you-want>'
    }
    
and install dependencies
	
	ctx install
    
Then, use `require` method in your module
    
    var hippo = require('hippo');
    
Finally, start cortex server
    
    ctx server
    
Then cortex will care all the rest.


## API Documentation

### hippo: constructor
': constructor' means the `module.exports` of module 'hippo' is a constructor that we should use it with the `new` keyword

	new hippo(options)
	
#### options
- options.name {String}



### hippo.\<method-name\>(arguments)
Means this is a static method of `module.exports`

#### arguments
// arguments description here

### .\<method-name\>(arguments)
Mean this is a method of the instance

#### arguments
// arguments description here