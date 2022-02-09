# Legacy Support for Open MCT

This plugin can be used by projects to retain support for Open MCT's legacy API and plugins, all of which have now been removed from the main Open MCT repository. 

We strongly encourage users to migrate to [our modern API](https://github.com/nasa/openmct/blob/master/API.md).

# Installing

### From the command line
```
npm install --save-dev nasa/openmct-legacy-support
```

### In your code

Note that this plugin will need to be installed before any plugins or code that make use of the legacy API.

``` JavaScript
import OpenMCTLegacySupport from 'openmct-legacy-support'

openmct.install(OpenMCTLegacySupport());
```
