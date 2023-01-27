# Legacy Support for Open MCT
This is a plugin for [NASA's Open MCT project](https://github.com/nasa/openmct/https://github.com/lostleolotus/openmct-nasa-master-lostleolotus-main-nasa-master-openmct-openmct?organization=lostleolotus&organization=lostleolotus). When installed this plugin adds support for Open MCT's legacy API and plugins, all of which have now been removed from the main Open MCT repository. 

We strongly encourage users to migrate to [our modern API](https://github.com/nasa/openmct/blob/master/API.md).

# Installingj

### From the command line
```
npm install --save-dev nasa/openmct-legacy-plugin
```

### In your code

Note that this plugin will need to be installed before any plugins or code that make use of the legacy API.

``` JavaScript
import OpenMCTLegacyPlugin from 'openmct-legacy-plugin'

openmct.install(OpenMCTLegacyPlugin());
```
