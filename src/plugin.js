/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2021, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/
import installDefaultBundles from './bundleSupport/installDefaultBundles';
import BundleRegistry from './bundleSupport/BundleRegistry';
import Main from './platform/framework/src/Main';
import DomainObjectImpl from './platform/core/src/objects/DomainObjectImpl';
import ContextualDomainObject from './platform/core/src/capabilities/ContextualDomainObject';
import objectUtils from 'objectUtils';

export default function LegacySupportPlugin() {
    return function install(openmct) {
        openmct.legacyBundle = {
            extensions: {
                services: [
                    {
                        key: "openmct",
                        implementation: function ($injector) {
                            openmct.$injector = $injector;

                            return openmct;
                        },
                        depends: ['$injector']
                    }
                ]
            }
        };

        openmct.legacyExtension = function (category, extension) {
            this.legacyBundle.extensions[category] =
                this.legacyBundle.extensions[category] || [];
            this.legacyBundle.extensions[category].push(extension);
        }.bind(openmct);

        /**
         * Return a legacy object, for compatibility purposes only.  This method
         * will be deprecated and removed in the future.
         * @private
         */
        openmct.legacyObject = function (domainObject) {
            let capabilityService = this.$injector.get('capabilityService');

            function instantiate(model, keyString) {
                const capabilities = capabilityService.getCapabilities(model, keyString);
                model.id = keyString;

                return new DomainObjectImpl(keyString, model, capabilities);
            }

            if (Array.isArray(domainObject)) {
                // an array of domain objects. [object, ...ancestors] representing
                // a single object with a given chain of ancestors.  We instantiate
                // as a single contextual domain object.
                return domainObject
                    .map((o) => {
                        let keyString = openmct.objects.makeKeyString(o.identifier);
                        let oldModel = objectUtils.toOldFormat(o);

                        return instantiate(oldModel, keyString);
                    })
                    .reverse()
                    .reduce((parent, child) => {
                        return new ContextualDomainObject(child, parent);
                    });

            } else {
                let keyString = openmct.objects.makeKeyString(domainObject.identifier);
                let oldModel = openmct.objects.toOldFormat(domainObject);

                return instantiate(oldModel, keyString);
            }
        }.bind(openmct);

        openmct.legacyRegistry = new BundleRegistry();
        installDefaultBundles(openmct.legacyRegistry);

        openmct.plugins.Elasticsearch = function (url) {
            return function (openmct) {
                if (url) {
                    const bundleName = "config/elastic";
                    openmct.legacyRegistry.register(bundleName, {
                        "extensions": {
                            "constants": [
                                {
                                    "key": "ELASTIC_ROOT",
                                    "value": url,
                                    "priority": "mandatory"
                                }
                            ]
                        }
                    });
                    openmct.legacyRegistry.enable(bundleName);
                }
    
                openmct.legacyRegistry.enable("platform/persistence/elastic");
            };
        };

        const patchedStart = openmct.start.bind(openmct);
        openmct.start = async (element) => {
            openmct.legacyRegistry.register('adapter', openmct.legacyBundle);
            openmct.legacyRegistry.enable('adapter');

            openmct.legacyExtension('runs', {
                depends: ['navigationService'],
                implementation: function (navigationService) {
                    navigationService
                        .addListener(openmct.emit.bind(openmct, 'navigation'));
                }
            });

            openmct.types.listKeys().forEach(function (typeKey) {
                const type = openmct.types.get(typeKey);
                const legacyDefinition = type.toLegacyDefinition();
                legacyDefinition.key = typeKey;
                openmct.legacyExtension('types', legacyDefinition);
            });

            const main = new Main();
            const angularInstance = await main.run(openmct);

            openmct.$angular = angularInstance;
            openmct.$injector.get('objectService');

            return patchedStart(element);
        };

    };
}
