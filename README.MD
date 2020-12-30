# SingleFile tools

## Manual installation

- Install [Node.js](https://nodejs.org)

- Download and unzip the [master archive](https://github.com/gildas-lormeau/SingleFile-tools/archive/master.zip)

  `unzip master.zip .`

  `cd SingleFile-tools-master`

- Install dependencies
  
  `npm install`  
  
## Run

- Syntax
 
  `node screenshot <output> [url] [options ...]`

- Display help

  `node screenshot --help`

- Examples

  - Save a screenshot of https://www.wikipedia.org in a file named ` wikipedia.png`

  `node screenshot wikipedia.png https://www.wikipedia.org`

  - Save a screenshot from a saved page named ` wikipedia.html`

  `node screenshot wikipedia.png < wikipedia.html`