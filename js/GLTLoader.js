/**
 * GLTFLoader for Three.js r128
 * This is a simplified implementation for loading GLTF/GLB files
 */

(function() {
    'use strict';

    class GLTFLoader {
        constructor(manager) {
            this.manager = manager !== undefined ? manager : THREE.DefaultLoadingManager;
        }

        load(url, onLoad, onProgress, onError) {
            const scope = this;
            const loader = new THREE.FileLoader(this.manager);
            loader.setResponseType('arraybuffer');

            loader.load(
                url,
                function (data) {
                    try {
                        scope.parse(data, '', onLoad, onError);
                    } catch (e) {
                        if (onError) {
                            onError(e);
                        } else {
                            console.error(e);
                        }
                        scope.manager.itemError(url);
                    }
                },
                onProgress,
                onError
            );
        }

        parse(data, path, onLoad, onError) {
            const content = {};
            const extensions = {};

            if (typeof data === 'string') {
                content.gltf = JSON.parse(data);
            } else {
                const magic = new TextDecoder().decode(new Uint8Array(data, 0, 4));

                if (magic === 'glTF') {
                    extensions.KHR_BINARY_GLTF = new GLTFBinaryExtension(data);
                    content.gltf = JSON.parse(extensions.KHR_BINARY_GLTF.content);
                } else {
                    const textDecoder = new TextDecoder();
                    content.gltf = JSON.parse(textDecoder.decode(data));
                }
            }

            if (content.gltf.asset === undefined || content.gltf.asset.version[0] < 2) {
                if (onError) {
                    onError(new Error('GLTFLoader: Unsupported asset version.'));
                }
                return;
            }

            const parser = new GLTFParser(content.gltf, extensions, {
                path: path || '',
                manager: this.manager
            });

            parser.parse(function (scene, scenes, cameras, animations, json) {
                const gltf = {
                    scene: scene,
                    scenes: scenes,
                    cameras: cameras,
                    animations: animations,
                    asset: json.asset,
                    userData: {}
                };

                onLoad(gltf);
            }, onError);
        }
    }

    class GLTFBinaryExtension {
        constructor(data) {
            this.name = 'KHR_binary_glTF';
            this.content = null;
            this.body = null;

            const headerView = new DataView(data, 0, 12);
            
            this.header = {
                magic: new TextDecoder().decode(new Uint8Array(data.slice(0, 4))),
                version: headerView.getUint32(4, true),
                length: headerView.getUint32(8, true)
            };

            const chunkView = new DataView(data, 12);
            let chunkIndex = 0;

            while (chunkIndex < this.header.length - 12) {
                const chunkLength = chunkView.getUint32(chunkIndex, true);
                const chunkType = chunkView.getUint32(chunkIndex + 4, true);

                if (chunkType === 0x4E4F534A) { // JSON
                    const contentArray = new Uint8Array(data, 12 + chunkIndex + 8, chunkLength);
                    this.content = new TextDecoder().decode(contentArray);
                } else if (chunkType === 0x004E4942) { // BIN
                    const byteOffset = 12 + chunkIndex + 8;
                    this.body = data.slice(byteOffset, byteOffset + chunkLength);
                }

                chunkIndex += chunkLength + 8;
            }
        }
    }

    class GLTFParser {
        constructor(json, extensions, options) {
            this.json = json;
            this.extensions = extensions;
            this.options = options;
            this.cache = { meshes: {}, materials: {} };
        }

        parse(onLoad, onError) {
            const parser = this;
            const json = this.json;

            Promise.all([
                this.loadScenes(),
                this.loadAnimations()
            ]).then(function (results) {
                const scenes = results[0];
                const animations = results[1];

                onLoad(scenes[0], scenes, [], animations, json);
            }).catch(onError);
        }

        loadScenes() {
            const json = this.json;
            const scenes = [];

            if (json.scenes) {
                for (let i = 0; i < json.scenes.length; i++) {
                    scenes.push(this.loadScene(i));
                }
            } else {
                scenes.push(this.createDefaultScene());
            }

            return Promise.all(scenes);
        }

        loadScene(sceneIndex) {
            const json = this.json;
            const sceneDef = json.scenes[sceneIndex];
            const scene = new THREE.Group();

            if (sceneDef.name !== undefined) {
                scene.name = sceneDef.name;
            }

            if (sceneDef.nodes) {
                const nodePromises = [];

                for (let i = 0; i < sceneDef.nodes.length; i++) {
                    nodePromises.push(this.loadNode(sceneDef.nodes[i]));
                }

                return Promise.all(nodePromises).then(function (nodes) {
                    for (let i = 0; i < nodes.length; i++) {
                        scene.add(nodes[i]);
                    }
                    return scene;
                });
            }

            return Promise.resolve(scene);
        }

        loadNode(nodeIndex) {
            const json = this.json;
            const nodeDef = json.nodes[nodeIndex];
            const node = new THREE.Object3D();

            if (nodeDef.name !== undefined) {
                node.name = nodeDef.name;
            }

            if (nodeDef.matrix !== undefined) {
                const matrix = new THREE.Matrix4();
                matrix.fromArray(nodeDef.matrix);
                node.applyMatrix4(matrix);
            } else {
                if (nodeDef.translation !== undefined) {
                    node.position.fromArray(nodeDef.translation);
                }

                if (nodeDef.rotation !== undefined) {
                    node.quaternion.fromArray(nodeDef.rotation);
                }

                if (nodeDef.scale !== undefined) {
                    node.scale.fromArray(nodeDef.scale);
                }
            }

            const promises = [];

            if (nodeDef.mesh !== undefined) {
                promises.push(this.loadMesh(nodeDef.mesh).then(function (mesh) {
                    node.add(mesh);
                }));
            }

            if (nodeDef.children) {
                const childPromises = [];

                for (let i = 0; i < nodeDef.children.length; i++) {
                    childPromises.push(this.loadNode(nodeDef.children[i]));
                }

                promises.push(Promise.all(childPromises).then(function (children) {
                    for (let i = 0; i < children.length; i++) {
                        node.add(children[i]);
                    }
                }));
            }

            return Promise.all(promises).then(function () {
                return node;
            });
        }

        loadMesh(meshIndex) {
            const parser = this;
            const json = this.json;
            const meshDef = json.meshes[meshIndex];

            if (this.cache.meshes[meshIndex]) {
                return Promise.resolve(this.cache.meshes[meshIndex].clone());
            }

            const primitivePromises = [];

            for (let i = 0; i < meshDef.primitives.length; i++) {
                primitivePromises.push(this.loadPrimitive(meshDef.primitives[i]));
            }

            return Promise.all(primitivePromises).then(function (primitives) {
                const mesh = primitives.length === 1
                    ? primitives[0]
                    : new THREE.Group();

                if (primitives.length > 1) {
                    for (let i = 0; i < primitives.length; i++) {
                        mesh.add(primitives[i]);
                    }
                }

                if (meshDef.name !== undefined) {
                    mesh.name = meshDef.name;
                }

                parser.cache.meshes[meshIndex] = mesh;

                return mesh;
            });
        }

        loadPrimitive(primitiveDef) {
            const geometry = this.loadGeometry(primitiveDef);
            const material = this.loadMaterial(primitiveDef.material);

            return Promise.all([geometry, material]).then(function (results) {
                const geometry = results[0];
                const material = results[1];

                const mesh = new THREE.Mesh(geometry, material);

                return mesh;
            });
        }

        loadGeometry(primitiveDef) {
            const geometry = new THREE.BufferGeometry();

            const attributes = primitiveDef.attributes;

            const pending = [];

            for (const attributeName in attributes) {
                const accessorIndex = attributes[attributeName];
                pending.push(
                    this.loadAccessor(accessorIndex).then(function (accessor) {
                        return { name: attributeName, accessor: accessor };
                    })
                );
            }

            if (primitiveDef.indices !== undefined) {
                pending.push(
                    this.loadAccessor(primitiveDef.indices).then(function (accessor) {
                        return { name: 'index', accessor: accessor };
                    })
                );
            }

            return Promise.all(pending).then(function (accessors) {
                for (let i = 0; i < accessors.length; i++) {
                    const attribute = accessors[i];
                    const attributeName = attribute.name;
                    const accessor = attribute.accessor;

                    if (attributeName === 'index') {
                        geometry.setIndex(new THREE.BufferAttribute(accessor.array, accessor.itemSize));
                    } else {
                        const threeAttributeName = attributeName === 'POSITION' ? 'position' :
                            attributeName === 'NORMAL' ? 'normal' :
                            attributeName === 'TEXCOORD_0' ? 'uv' :
                            attributeName;

                        geometry.setAttribute(
                            threeAttributeName.toLowerCase(),
                            new THREE.BufferAttribute(accessor.array, accessor.itemSize)
                        );
                    }
                }

                geometry.computeBoundingSphere();

                return geometry;
            });
        }

        loadAccessor(accessorIndex) {
            const json = this.json;
            const accessorDef = json.accessors[accessorIndex];
            const bufferViewIndex = accessorDef.bufferView;
            const bufferViewDef = json.bufferViews[bufferViewIndex];

            return this.loadBuffer(bufferViewDef.buffer).then(function (buffer) {
                const byteOffset = (bufferViewDef.byteOffset || 0) + (accessorDef.byteOffset || 0);
                const byteLength = bufferViewDef.byteLength;

                const arrayBuffer = buffer.slice(byteOffset, byteOffset + byteLength);

                const itemSize = {
                    'SCALAR': 1,
                    'VEC2': 2,
                    'VEC3': 3,
                    'VEC4': 4,
                    'MAT2': 4,
                    'MAT3': 9,
                    'MAT4': 16
                }[accessorDef.type];

                const TypedArray = {
                    5120: Int8Array,
                    5121: Uint8Array,
                    5122: Int16Array,
                    5123: Uint16Array,
                    5125: Uint32Array,
                    5126: Float32Array
                }[accessorDef.componentType];

                const array = new TypedArray(arrayBuffer);

                return {
                    array: array,
                    itemSize: itemSize,
                    count: accessorDef.count
                };
            });
        }

        loadBuffer(bufferIndex) {
            const json = this.json;
            const bufferDef = json.buffers[bufferIndex];
            const extensions = this.extensions;

            if (extensions.KHR_BINARY_GLTF && extensions.KHR_BINARY_GLTF.body) {
                return Promise.resolve(extensions.KHR_BINARY_GLTF.body);
            }

            if (bufferDef.uri) {
                return new Promise((resolve, reject) => {
                    const loader = new THREE.FileLoader();
                    loader.setResponseType('arraybuffer');
                    loader.load(bufferDef.uri, resolve, undefined, reject);
                });
            }

            return Promise.reject(new Error('Buffer loading failed'));
        }

        loadMaterial(materialIndex) {
            if (materialIndex === undefined) {
                return Promise.resolve(new THREE.MeshStandardMaterial({ color: 0xcccccc }));
            }

            if (this.cache.materials[materialIndex]) {
                return Promise.resolve(this.cache.materials[materialIndex]);
            }

            const json = this.json;
            const materialDef = json.materials[materialIndex];
            const materialParams = {};

            if (materialDef.name) {
                materialParams.name = materialDef.name;
            }

            const pbr = materialDef.pbrMetallicRoughness || {};

            if (pbr.baseColorFactor) {
                materialParams.color = new THREE.Color().fromArray(pbr.baseColorFactor);
                materialParams.opacity = pbr.baseColorFactor[3];
            }

            if (pbr.metallicFactor !== undefined) {
                materialParams.metalness = pbr.metallicFactor;
            }

            if (pbr.roughnessFactor !== undefined) {
                materialParams.roughness = pbr.roughnessFactor;
            }

            const material = new THREE.MeshStandardMaterial(materialParams);

            this.cache.materials[materialIndex] = material;

            return Promise.resolve(material);
        }

        loadAnimations() {
            const json = this.json;

            if (!json.animations || json.animations.length === 0) {
                return Promise.resolve([]);
            }

            return Promise.resolve([]);
        }

        createDefaultScene() {
            const scene = new THREE.Group();
            scene.name = 'Scene';
            return Promise.resolve(scene);
        }
    }

    // Export to THREE namespace
    THREE.GLTFLoader = GLTFLoader;

})();